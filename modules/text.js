// 'use strict';

// Import dependencies
const
    synonyms = require('./vocabulary/synonyms'),
    actions = require('./vocabulary/actions'),
    targets = require('./vocabulary/targets'),
    infos = require('./vocabulary/infos'),
    emotions = require('./vocabulary/emotions');

// Maximum considered distance when extracting entities
// meaning that tokens of the same entity must be at most 3 tokens away
const MAX_BACKWARD_DISTANCE = 3
const MAX_FORWARD_DISTANCE = 4

let
    synonyms_trie = {},
    entities_pool = {},
    tokens_pool = [];

// Create synonyms_trie (forEach returns nothing)
synonyms.forEach((synonym) => {

    // Map function returns an array of same size
    let tokenized_surfaces = synonym.surfaces.map(_tokenize);

    tokenized_surfaces.forEach((surface) => {

        // Save current branches and lemmas of TRIE node
        let current_lemmas = undefined;
        let current_branch = synonyms_trie;

        // Surfaces is composed of one or more tokens
        for (let index = 0; index < surface.length; index++) {

            // Get current token
            let token = surface[index];

            if (!(token in current_branch)) {
                // Initializes a node of the TRIE with a tuple where the first item is
                // an array that holds all lemmas for the tokens that leads to this branch
                // and the second are the ramifications of the TRIE for the current node
                current_branch[token] = [[], {}];
            }

            // Update previous and current branches
            current_lemmas = current_branch[token][0];
            current_branch = current_branch[token][1];
        }

        // Set the lemma for current surface
        current_lemmas.push(synonym.lemma);
    })
});

_processEntities(actions, 'action')
_processEntities(targets, 'target')
_processEntities(infos, 'info')
_processEntities(emotions, 'emotion')

function _processEntities(entities, entity_type) {
    // This function is responsible for creating entities_pool and tokens_pool.
    // entities_pool is a dictionary that maps the entity's code to its surfaces, requirements and optionals information.
    // tokens_pool is an array with all tokens that can be understand by the bot.

    entities.forEach((entity) => {

        // Combine the entity_type with its original code to produce a new one
        let entity_code = entity_type + '_' + entity.code

        // Tokenize and lemmatize surfaces
        let lemmatized_surfaces = entity.surfaces.map(_tokenize).map(_lemmatize);

        // Build entities_pool
        if (!(entity_code in entities_pool)) {
            entities_pool[entity_code] = {
                surfaces: ('surfaces' in entity ? lemmatized_surfaces : []),
                required: ('required' in entity ? entity['required'] : []),
                optional: ('optional' in entity ? entity['optional'] : [])
            }
        } else {
            throw {
                name: "Duplicated entity_code",
                message: "There are two entities under the code: " + entity_code,
            };
        }

        // Build tokens_pool
        lemmatized_surfaces.forEach((surface) => {
            tokens_pool = tokens_pool.concat(surface)
        })
    });
}

function _tokenize(text) {
    // This regex is divided into 3 parts,
    // the first match contractions (e.g.: 'm, 've, 're)
    // the second match words and the last some punctuation
    let tokenizer = /(?<=\w)'\w+|[\w]+|[.!?]/g;
    
    // Lower the case of all letters
    text = text.toLowerCase();

    // Divide the text into tokens
    let tokens = text.match(tokenizer);

    // Tokens will always be an array
    return tokens;
}

function _lemmatize(tokens) {

    // Get initial branch of synonyms trie
    let current_branch = synonyms_trie

    // Index used to keep track of the last token compared against the initial branch
    let rollback_index = -1

    // Lemmas for current token
    let current_lemmas = []

    let lemmatized_tokens = []
    for (let index = 0; index < tokens.length; index++) {

        let current_token = tokens[index];

        // console.log('\nAnalysing token: ' + current_token)
        
        if (current_token in current_branch) {

            // console.log('\tToken is in TRIE')
            
            if (rollback_index === -1) {
                // If following tokens lead to incomplete lemma, restart from rollback_index.
                // Before restarting the `for`, index will be increased by 1
                rollback_index = index
            }
            
            // Update current lemmas and branch
            current_lemmas = current_branch[current_token][0]
            current_branch = current_branch[current_token][1]
            
        } else {

            // console.log('\tToken not in TRIE')
            
            // Current lemmas led to somethig
            if (rollback_index != -1) {
                // console.log('\tbut previous tokens led to something')
                
                if (current_lemmas.length) {
                    // console.log('\tthat something was a complete lemma')
                    // There are current lemmas!
                    lemmatized_tokens = lemmatized_tokens.concat(current_lemmas)
                    
                    // Reset current lemmas and current branch
                    current_lemmas = []
                    current_branch = synonyms_trie

                    // Analyse the current token one more time
                    index -= 1 
                    
                } else {

                    // console.log('\tthat something was an INcomplete lemma')

                    // Add token at rollback position to lemmatized_tokens
                    lemmatized_tokens.push(tokens[rollback_index])
                    
                    // Reset `for` index
                    index = rollback_index
                }
                
                // Reset rollback_index
                rollback_index = -1

            } else {

                // console.log('\tand previous tokens led to nothing')
                
                // Keeps tokens that has no lemma
                lemmatized_tokens.push(current_token)
            }
        }
        
        // If it is in the last token and the lemma still incomplete, 
        // add current lemma and rollback
        if (index === tokens.length - 1 && rollback_index != -1) {

            // console.log('\n\tToken in last position and the is something!!!')

            // Add token at rollback position to lemmatized_tokens
            lemmatized_tokens.push(tokens[rollback_index])
            
            // Reset `for` index and rollback_index
            index = rollback_index
            rollback_index = -1
        }
        
        // console.log('\ncurrent lemmatized tokens: ' + lemmatized_tokens)
        
    }
    
    // Include (if any) current lemmas
    lemmatized_tokens = lemmatized_tokens.concat(current_lemmas)
    
    // console.log('\nFinal lemmatized tokens: ' + lemmatized_tokens)

    return lemmatized_tokens
}

function _buildInvertedIndex(lemmatized_tokens, verbose = 0) {

    let inverted_index = {}
    
    // Create an positional inverted index to help the message processing
    for (let index = 0; index < lemmatized_tokens.length; index++) {
        
        let token = lemmatized_tokens[index];

        if (verbose)
        console.log('\nCurrent token for inverted index creation: ' + token)
        
        // Check if token is useful
        if (tokens_pool.indexOf(token) > -1) {
            
            if (verbose)
                console.log('\ttoken inside pool!!')

            // Adds to inverted index
            if (!(token in inverted_index)) {

                if (verbose)
                    console.log('\ttoken not in inverted index!!!')

                inverted_index[token] = []
            }

            inverted_index[token].push(index)
        }
    }

    if (verbose)
        console.log('inverted_index: ' + JSON.stringify(inverted_index))

    return inverted_index
}

function _extractEntities(inverted_index, tokens_amount, verbose = 0) {

    // Create a dictionary that maps extracted entities to their ranges
    let extracted_entities = {}

    // Extract all entities found for given tokens
    for (code in entities_pool) {

        // Get all surfaces for current entity
        entity_surfaces = entities_pool[code].surfaces

        if (verbose)
            console.log('\nCurrent code being analysed: ' + code)
        
        // For every surface, checks if its tokens are not too far apart
        for (let surface_index = 0; surface_index < entity_surfaces.length; surface_index++) {
            
            // Collect all tokens for current surface
            let surface_tokens = entity_surfaces[surface_index];
            
            if (verbose)
                console.log('\tCurrent SURFACE being analysed: ' + surface_tokens)
            
            // This array defines the positions allowed for tokens of the same surface
            let entity_range = []
            
            // Iterates over all possible tokens updating entity_range array
            for (let token_index = 0; token_index < surface_tokens.length; token_index++) {
                
                // Get current token
                let token = surface_tokens[token_index];
                
                if (verbose)
                    console.log('\t\tCurrent TOKEN being analysed: ' + token)
                
                // Current token can lead to valid entity, 
                if (token in inverted_index) {

                    if (verbose)
                        console.log('\t\tToken is in message!!')
                    
                    let token_range = []
                    
                    // Filter valid positions using existing entity ranges
                    inverted_index[token].forEach((position) => {

                        // console.log('\t\t\tAnalysing position ' + position)
                        
                        // If there are ranges for current entity
                        if (entity_range.length) {

                            // Filter valid positions
                            entity_range.forEach(([start, end, _1, _2]) => {
                                
                                // Valid positions are inside current ranges
                                if (position >= start && position <= end) {
                                    token_range.push([
                                        position,
                                        (position - MAX_BACKWARD_DISTANCE < start) ? position - MAX_BACKWARD_DISTANCE : start,
                                        (position + MAX_FORWARD_DISTANCE > end) ? position + MAX_FORWARD_DISTANCE : end
                                    ]);
                                }
                            });
                        } else {
                            
                            // Since there are no ranges yet, every position is valid
                            token_range.push([
                                position,
                                position - MAX_BACKWARD_DISTANCE,
                                position + MAX_FORWARD_DISTANCE
                            ]);
                        }
                    });

                    if (verbose)
                        console.log('\t\tToken range: ' + token_range)
                    
                    // Update entity range using current boundaries
                    entity_range = token_range.map(([_, start, end]) => {
                        // Fix start and end positions, to prevent out of bounds
                        let inbound_start = (start < 0) ? 0 : start
                        let inbound_end = (end > tokens_amount) ? tokens_amount : end

                        return [start, end, inbound_start, inbound_end]
                    });
                    
                    if (verbose)
                        console.log('\tCurrent entity_range: ' + entity_range)

                } else {

                    if (verbose)
                        console.log('\t\tToken not in message :(')
                    
                    // Sice current token is not in text, this surface cannot lead to a valid entity
                    entity_range = []
                    
                    // Stop analysing this surface
                    break
                }
            }
            
            // If there are ranges for current entity, entity is valid
            if (entity_range.length) {
                
                if (!(code in extracted_entities)) {
                    extracted_entities[code] = []
                }
                
                // Save entity boundaries, does this for every surface
                extracted_entities[code] = extracted_entities[code].concat(entity_range)

                if (verbose)
                    console.log('\tCurrent entity is valid!! Extracted entities: ' + extracted_entities)
            }
        }
    }

    if (verbose)
        console.log('\n\t Final extracted entities: ' + JSON.stringify(extracted_entities))

    return extracted_entities;
}

// Auxiliary function for extract method
function _bindEntity(extracted_entities, base_code, related_code, remove_related, bind_callback) {

    // Current related entity was extracted
    if (related_code in extracted_entities) {

        // Infer related entity position
        let related_positions = extracted_entities[related_code].map(([_1, _2, inbound_start, inbound_end]) => {
            return inbound_start + inbound_end/2
        })

        // console.log('\t\tAnalysing possible related: ' + related_code)

        let valid_relation = false
        extracted_entities[base_code].some(([start, end, _1, _2]) => {

            // Related entities, most of the times, will come after (or during) the base entity
            // e.g.: can you tell me about chuck norris? -> action.knowledge + target.chuck_norris
            start += MAX_BACKWARD_DISTANCE

            // console.log('\t\t\tStart: ' + start)
            // console.log('\t\t\tEnd: ' + end)

            // Tries to validate current entity with all possible related
            for (let index = 0; index < related_positions.length; index++) {
                let position = related_positions[index];

                // console.log('\t\t\tPositioning: ' + position)

                if (position >= start && position <= end) {


                    // TODO: Add cardinality parameter for every entity relation

                    if (remove_related) {
                        // Remove used required entity from extracted_entities
                        extracted_entities[related_code].splice(index, 1)
                    }

                    // Validate relation
                    valid_relation = true

                    bind_callback()
                }
                
                if (valid_relation) {
                    break
                }
            }
            

            // Break `some` loop as soon as relation is validated
            // return valid_relation
        })
    }
}

function _buildContexts(extracted_entities, verbose = 0) {

    let contexts = []
    
    // Filter extracted entities by required and optional information to create contexts
    for (code in extracted_entities) {
        
        if (verbose)
            console.log('\nCode being analysed for required and optional: ' + code)
        
        let context_codes = []
        
        if (entities_pool[code].required.length) {

            // NOTE: For now, requireds are not being used. Because if an action has requirements,
            //       when they are not met, the action is ignored

            if (verbose)
                console.log('\tThere are possible requireds!!')
            
            // Filter by required
            entities_pool[code].required.forEach((required_entity_code) => {
                
                // Tries to relate entities and its required
                _bindEntity(extracted_entities, code, required_entity_code, true, () => {

                    if (verbose)
                        console.log('\t\tValid relation with: ' + required_entity_code)
                    
                    // Save valid codes for current context
                    // Each required creates a new context
                    context_codes.push([code, required_entity_code])
                })
            });
        } else {
            
            if (verbose)
                console.log('\tThere are no need for requirements!!')
            
            // There are no requirements
            context_codes.push([code])
        }

        if (verbose)
            console.log('\tCurrent context codes: ' + context_codes)
        
        if (entities_pool[code].optional.length) {
            
            if (verbose)
                console.log('\nThere are possible optional!!')
            
            // Check for optionals
            entities_pool[code].optional.forEach((optional_entity_code) => {

                // Tries to relate entities and its optional
                _bindEntity(extracted_entities, code, optional_entity_code, true, () => {
                    
                    if (verbose)
                        console.log('\t\tValid relation with: ' + optional_entity_code)

                    // Save valid codes for current context
                    // Each required creates a new context
                    context_codes.push([code, optional_entity_code])
                })
    
            });
        }

        if (verbose)
            console.log('\nextracted context_codes: ' + context_codes)

        context_codes.forEach((codes) => {
            
            let actions = []
            let targets = []
            let infos = []
            let emotions = []

            for (let index = 0; index < codes.length; index++) {
                let context_code = codes[index];

                if (verbose)
                    console.log('context_code: ' + codes)

                if (context_code.includes('action')) {
                    actions.push(context_code)

                } else if ((context_code.includes('target'))) {
                    targets.push(context_code)

                } else if ((context_code.includes('info'))) {
                    infos.push(context_code)

                }  else if ((context_code.includes('emotion'))) {
                    emotions.push(context_code)

                } else {
                    throw {
                        name: "Entity with unsupported type",
                        message: "An entity with an unknow type was found (" + context_code + "). Please handle this type in text._extract function.",
                    };
                }
            }

            // Try to merge current context with one previously created. Merge on 'actions'
            let merged = false
            contexts.forEach((context) => {
                let can_merge = true
                if (context.actions.length != actions.length) {
                    can_merge = false
                } else {
                    context.actions.forEach((action) => {
                        if (actions.indexOf(action) == -1) {
                            can_merge = false
                        }
                    });
                }

                if (can_merge) {
                    merged = true

                    context.targets = context.targets.concat(targets)
                    context.infos = context.infos.concat(infos)
                    context.emotions = context.emotions.concat(emotions)
                }
            });

            if (!merged) {

                // Only adds contexts with actions or emotions
                if (actions.length || emotions.length) {
                    // Every context is a dictionary with actions, targets and emotions.
                    contexts.push(
                        {
                            actions: actions,
                            targets: targets,
                            infos: infos,
                            emotions: emotions
                        }
                    );
                }
            }
        }); 
    }

    return contexts
}

function _extract(lemmatized_tokens, verbose = 0) {
    // This function uses the TRIE structure to find written entities
    // An entity is only considered as found/written, if they are complete
    // If entities are overlapped, only the biggest is considered complete (FOR NOW)

    let inverted_index = _buildInvertedIndex(lemmatized_tokens, verbose)

    let extracted_entities = _extractEntities(inverted_index, lemmatized_tokens.length, verbose)

    let contexts = _buildContexts(extracted_entities)
    
    // Returns an array with all extracted contexts.
    return contexts
}

function pipeline(raw_text) {
    let tokens = _tokenize(raw_text)
    let lemmas = _lemmatize(tokens)
    let contexts = _extract(lemmas)
    
    if (contexts.length === 0) {
        contexts.push({
            actions: [],
            targets: [],
            infos: [],
            emotions: []
        });
    }

    return contexts
}

module.exports = {
    pipeline
};