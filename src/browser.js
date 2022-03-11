const { Logger }			= require('@whi/weblogger');
const log				= new Logger("crux-payload-parser");

const repr				= require('@whi/repr');
const Essence				= require('@whi/essence');
const EntityArchitect			= require('@whi/entity-architect');
const { Translator }			= Essence
const { Architecture,
	RemodelerError,
	EntityType }			= EntityArchitect;



const CC_DEFAULT_OPTIONS		= {
    "simulate_latency": false,
    "strict": false,
};
const UPGRADE_DEFAULT_OPTIONS		= {
    "parse_essence": true,
    "parse_entities": true,
};

// Steps for defining a client
//
//  - @whi/essence Translator	- for interpretting success/failure response and error conversion
//  - @whi/entity-architect	- for restructuring successful responses
//
class CruxConfig {
    constructor ( schema = {}, translator = [], options = {} ) {
	this.options			= Object.assign( {}, CC_DEFAULT_OPTIONS, options );

	if ( !(translator instanceof Translator) ) {
	    this.interpreter		= new Translator( translator );
	}

	if ( !(schema instanceof Architecture) ) {
	    const entity_types		= [];
	    for ( let [name, models] of Object.entries( schema ) ) {
		log.debug("Setting up EntityType(%s) with models: %s", name, Object.keys( models ).map( m => `'${m}'` ).join(", ") );
		const type		= new EntityType( name );
		for ( let [key, fn] of Object.entries( models ) ) {
		    type.model( key, fn );
		}
		entity_types.push( type );
	    }

	    log.info("Creating architecture with %s Entity definitions", entity_types.length );
	    this.schema			= new Architecture( entity_types );
	}
    }

    upgrade ( client, options = {} ) {
	if ( client.constructor.name !== "AgentClient" )
	    throw new TypeError(`Expected an instance of 'AgentClient' from @whi/holochain-client; not instance of '${client.constructor.name}'`);

	const opts			= Object.assign( {}, UPGRADE_DEFAULT_OPTIONS, options );

	if ( this.options.simulate_latency ) {
	    client.addProcessor("input", async input => {
		await new Promise( f => setTimeout(f, (Math.random() * 1_000) + 500) ); // range 500ms to 1500ms
		return input;
	    });
	}

	client.addProcessor("output", (essence, req) => {
	    if ( !(this.interpreter instanceof Translator) )
		throw new TypeError(`options.interpreter is not an instance of Translator; found type '${repr(this.interpreter)}'`);

	    try {
		log.debug("Parsing response type (%s) with metadata: %s", essence.type, essence.metadata, essence.payload );
		return this.interpreter.parse( essence );
	    } catch ( err ) {
		log.error("Error parsing response:", err );
		if ( this.options.strict )
		    throw err;
		else
		    return response;
	    }
	});

	client.addProcessor("output", (pack, req) => {
	    const payload		= pack.value();

	    if ( opts.parse_entities === false ) {
		log.warn("Skipping Entity parser because of option:", opts.parse_entities );
		return payload;
	    }

	    if ( !(this.schema instanceof Architecture) )
		throw new TypeError(`options.schema is not an instance of Architecture; found type '${repr(this.schema)}'`);

	    const composition		= pack.metadata("composition");
	    log.info("Payload has composition: %s", composition );

	    if ( payload instanceof Error )
		throw payload;

	    if ( composition === undefined )
		return payload;

	    try {
		log.debug("Parsing payload (%s):", composition, payload );
		return this.schema.deconstruct( composition, payload );
	    } catch ( err ) {
		if ( err instanceof RemodelerError )
		    err.unwrap();

		log.error("Error parsing payload:", err );
		if ( this.options.strict )
		    throw err;
		else
		    return payload;
	    }
	});

	return client;
    }
}


module.exports = {
    CruxConfig,

    Translator,
    Architecture,
    EntityType,

    Essence,
    EntityArchitect,

    log,
};
