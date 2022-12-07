const path				= require('path');
const log				= require('@whi/stdlog')(path.basename( __filename ), {
    level: process.env.LOG_LEVEL || 'fatal',
});

const expect				= require('chai').expect;

const { HoloHash }			= require('@whi/holo-hash');
const { AgentClient }			= require('@whi/holochain-client');
const { CruxConfig,
	...crux }			= require('../../src/index.js');
const { expect_reject }			= require('../utils.js');

if ( process.env.LOG_LEVEL )
    crux.log.setLevel( process.env.LOG_LEVEL.replace("silly", "trace") );

const AGENT				= (new HoloHash("uhCAkocJKdTlSkQFVmjPW_lA_A5kusNOORPrFYJqT8134Pag45Vjf")).bytes();
const ID				= (new HoloHash("uhCkkEvFsj08QdtgiUDBlEhwlcW5lsfqD4vKRcaGIirSBx0Wl7MVf")).bytes();
const ACTION				= (new HoloHash("uhCkkn_kIobHe9Zt4feh751we8mDGyJuBXR50X5LBqtcSuGLalIBa")).bytes();
const ADDRESS				= (new HoloHash("uhCEkU7zcM5NFGXIljSHjJS3mk62FfVRpniZQlg6f92zWHkOZpb2z")).bytes();

let content				= {
    "name": "Some Entity",
    "published_at": 1624661323383,
    "last_updated": 1624661325451,
    "author": AGENT,
    "deprecation": null,
    "metadata": {},
};
let payload				= {
    "id": ID,
    "action": ACTION,
    "address": ADDRESS,
    "type": "entity",
    "content": content,
};

let collection_payload			= [
    Object.assign( {}, payload ),
    Object.assign( {}, payload ),
];



const crux_config			= new CruxConfig({
    "entity": ( content ) => {
	content.published_at	= new Date( content.published_at );
	content.last_updated	= new Date( content.last_updated );
	content.author		= new HoloHash( content.author );
    },
});


function basic_tests () {
    it("should deconstruct entity payload using schema", async () => {
	let data			= crux_config.schema.deconstruct( "entity", payload );

	expect( data.published_at	).to.be.instanceof( Date );
	expect( data.last_updated	).to.be.instanceof( Date );
	expect( data.author		).to.be.instanceof( HoloHash );
    });

    it("should deconstruct collection payload using processors", async () => {
	let client			= new AgentClient( AGENT, {}, 1 );
	crux_config.upgrade( client );

	let output			= {
	    "type": "success",
	    "metadata": {
		"composition": "entity_collection",
	    },
	    "payload": collection_payload.slice(),
	};

	for ( let processor of client.post_processors ) {
	    output			= await processor( output );
	}

	expect( output			).to.have.length( 2 );
    });

    it("should deconstruct something without a composition value", async function () {
	let client			= new AgentClient( AGENT, {}, 1 );
	crux_config.upgrade( client );

	let output			= {
	    "type": "success",
	    "metadata": {},
	    "payload": Object.assign( {}, content ),
	};

	for ( let processor of client.post_processors ) {
	    output			= await processor( output );
	}

	expect( output.$id		).to.be.undefined;
	expect( output.name		).to.equal("Some Entity");
    });

    it("should deconstruct something with an unknown composition", async function () {
	let client			= new AgentClient( AGENT, {}, 1 );
	crux_config.upgrade( client );

	let output			= {
	    "type": "success",
	    "metadata": {
		"composition": "unknown",
	    },
	    "payload": Object.assign( {}, content ),
	};

	for ( let processor of client.post_processors ) {
	    output			= await processor( output );
	}

	expect( output.$id		).to.be.undefined;
	expect( output.name		).to.equal("Some Entity");
    });

    it("should deconstruct something without type", async function () {
	let client			= new AgentClient( AGENT, {}, 1 );
	crux_config.upgrade( client );

	let output			= Object.assign( {}, content );

	for ( let processor of client.post_processors ) {
	    output			= await processor( output );
	}

	expect( output.$id		).to.be.undefined;
	expect( output.name		).to.equal("Some Entity");
    });
}

function error_tests () {
    const interpreter			= crux_config.interpreter;
    const schema			= crux_config.schema;

    it("should fail because of missing Translator (interpreter)", async () => {
	let client			= new AgentClient( AGENT, {}, 1 );
	crux_config.upgrade( client );

	crux_config.interpreter		= null;

	await expect_reject( async () => {
	    await client.post_processors[0]( null );
	}, TypeError, "is not an instance of Translator" );
    });

    it("should fail because of missing Architecture (schema)", async () => {
	let client			= new AgentClient( AGENT, {}, 1 );
	crux_config.upgrade( client );

	crux_config.interpreter		= interpreter;
	crux_config.schema		= null;

	await expect_reject( async () => {
	    await client.post_processors[1]( { value: () => null } );
	}, TypeError, "is not an instance of Architecture" );
    });
}

describe("Unit", () => {

    describe("Basic", basic_tests );
    describe("Errors", error_tests );

});
