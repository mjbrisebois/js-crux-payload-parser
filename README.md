[![](https://img.shields.io/npm/v/@whi/crux-payload-parser/latest?style=flat-square)](http://npmjs.com/package/@whi/crux-payload-parser)

# Crux Payload Parser
A Javascript library that extends
[`@whi/holochain-client`](https://github.com/mjbrisebois/js-holochain-client) with support for
deconstructing data that implement [Essence
Payloads](https://github.com/mjbrisebois/essence-payloads-js/blob/37e53b483fb66af00daafd132189cb20e99731bb/docs/specification.md)
and Entity Architect structures.


## Overview
This package is simply the glue that combines 2 other packages and a peer dependency.

- [`@whi/essence`](https://www.npmjs.com/package/@whi/essence)
- [`@whi/entity-architect`](https://www.npmjs.com/package/@whi/entity-architect)

Peer
- [`@whi/holochain-client`](https://www.npmjs.com/package/@whi/holochain-client)

Latest versions

![](https://img.shields.io/npm/v/@whi/essence/latest?style=flat-square&label=@whi/essence)
![](https://img.shields.io/npm/v/@whi/entity-architect/latest?style=flat-square&label=@whi/entity-architect)
![](https://img.shields.io/npm/v/@whi/holochain-client/latest?style=flat-square&label=@whi/holochain-client)

## Install

```bash
npm i @whi/crux-payload-parser
```


## Basic usage

```javascript
const { AgentClient } = require('@whi/holochain-client');
const { CruxConfig } = require('@whi/crux-payload-parser');

const client = new AgentClient( agent, dna_map, connection, options );

const crux_config = new CruxConfig({
    "entity_name": ( content ) => {
        // restructure 'content' value
    },
});
crux_config.upgrade( client );


client.call( ... )
// Entity { ...content }
```


### Contributing

See [docs/API.md](docs/API.md)


### Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)
