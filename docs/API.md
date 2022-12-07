[back to README.md](../README.md)

# API Reference

Examples assume that the following dependencies are loaded
```javascript
const { AgentClient } = require('@whi/holochain-client');
const {
    CruxConfig,
} = require('@whi/hc-crux-client');

const client = new AgentClient( agent, dna_map, connection, options );
```


## `new CruxConfig( schema, translator, options )`
A class for defining response handling and restructuring.

- `schema` - (*required*) a map of Entity types and its remodeler used to create an instance of
  [`Architecture`](https://github.com/mjbrisebois/js-entity-architect/blob/518d2c508299a04321250e54db995b27785eb9bd/docs/API.md#new-architecture-entity_types-)
  - also accepts an instance of `Architecture` (from
    [`@whi/entity-architect`](https://www.npmjs.com/package/@whi/entity-architect))
- `translator` - (*required*) a list of expected error types used to create an instance of
  [`Translator`](https://github.com/mjbrisebois/essence-payloads-js/blob/37e53b483fb66af00daafd132189cb20e99731bb/docs/API.md#new-translator-expected_kinds---options---).
  - also accepts an instance of `Translator` (from
    [`@whi/essence`](https://www.npmjs.com/package/@whi/essence))
- `options` - optional parameters
- `options.simulate_latency` - a flag for turning on/off random request delays
  - defaults to `false`
- `options.strict` - a flag for turning on/off throwing errors when unexpected responses happen
  - defaults to `false`

Example
```javascript
const crux_config = new CruxConfig({
    "entity_name": ( content ) => {
        // restructure 'content' values
    },
});
```

### `<CruxConfig>.upgrade( client, options )`
Attach output processors to an instance of
[`AgentClient`](https://github.com/mjbrisebois/js-holochain-client/blob/a644ca5c33fc882d55ac91fbf0d027967043c998/docs/API_AgentClient.md#api-reference-for-agentclient-class).

- `client` - (*required*) an instance of `AgentClient`
- `options` - optional parameters
- `options.parse_entities` - a flag for turning on/off Entity destructuring
  - defaults to `true`

returns `client`

Example
```javascript
crux_config.upgrade( client );
```


## Module exports
```javascript
{
    CruxConfig,

    Translator,
    Architecture,
    EntityType,

    Essence,
    EntityArchitect,

    log,
}
```
