const path				= require('path');
const log				= require('@whi/stdlog')(path.basename( __filename ), {
    level: process.env.LOG_LEVEL || 'fatal',
});

// const why				= require('why-is-node-running');
const expect				= require('chai').expect;
const puppeteer				= require('puppeteer');
const http				= require('@whi/http');
const { HoloHash }			= require('@whi/holo-hash');

const HTTP_PORT				= 2222;

let browser;
let server;
let page;


async function create_page ( url ) {
    const page				= await browser.newPage();

    page.on("console", async ( msg ) => {
	let args			= await Promise.all( msg.args().map( async (jshandle) => await jshandle.jsonValue() ) );
	if ( args.length === 0 && log.levels[log.level] > 0 ) {
	    console.error("\033[90mPuppeteer console.log( \033[31m%s \033[90m)\033[0m", msg.text() );
	}
	else if ( log.levels[log.level] > 5 ) {
	    console.log("\033[90mPuppeteer console.log( \033[37m"+ args.shift() +" \033[90m)\033[0m", ...args );
	}
    });

    log.info("Go to: %s", url );
    await page.goto( url, { "waitUntil": "networkidle0" } );

    return page;
}


function client_tests () {
    it("should test CruxConfig schema", async function () {
	let result			= await page.evaluate(async function () {
	    let { CruxConfig,
		  log }			= CruxPayloadParser;
	    let { HoloHash }		= holohash;

	    log.setLevel("trace");

	    const crux_config		= new CruxConfig({
		"entity": {
		    "*": ( content ) => {
			content.published_at	= new Date( content.published_at );
			content.last_updated	= new Date( content.last_updated );
			content.author		= new HoloHash( content.author );
			return content;
		    },
		},
	    });

	    const AGENT			= (new HoloHash("uhCAkocJKdTlSkQFVmjPW_lA_A5kusNOORPrFYJqT8134Pag45Vjf")).bytes();
	    const ID			= (new HoloHash("uhCEkEvFsj08QdtgiUDBlEhwlcW5lsfqD4vKRcaGIirSBx0Wl7MVf")).bytes();
	    const ACTION		= (new HoloHash("uhCkkn_kIobHe9Zt4feh751we8mDGyJuBXR50X5LBqtcSuGLalIBa")).bytes();
	    const ADDRESS		= (new HoloHash("uhCEkU7zcM5NFGXIljSHjJS3mk62FfVRpniZQlg6f92zWHkOZpb2z")).bytes();

	    let payload			= {
		"id": ID,
		"action": ACTION,
		"address": ADDRESS,
		"type": {
		    "name": "entity",
		    "model": "detailed",
		},
		"content": {
		    "name": "Some Entity",
		    "published_at": 1624661323383,
		    "last_updated": 1624661325451,
		    "author": AGENT,
		    "deprecation": null,
		    "metadata": {},
		}
	    };

	    let data			= crux_config.schema.deconstruct( "entity", payload );
	    log.info("Enitty: %s", JSON.stringify(data.toJSON().content, null, 4) );

	    if ( !(data.published_at instanceof Date ) )
		return String(new Error(`published_at`));
	    if ( !(data.last_updated instanceof Date ) )
		return String(new Error(`last_updated`));
	    if ( !(data.author instanceof HoloHash ) )
		return String(new Error(`author`));

	    return true;
	});

	log.normal("Evaluate result: %s", result );
	expect( result			).to.be.true;
    });
}

function errors_tests () {
}

describe("E2E: Crux Client", () => {

    before(async function () {
	this.timeout( 10_000 );

	browser				= await puppeteer.launch();
	server				= new http.server();
	server.serve_local_assets( path.resolve( __dirname, "../../" ) );
	server.listen( HTTP_PORT )

	const test_url			= `http://localhost:${HTTP_PORT}/tests/e2e/index.html`;
	page				= await create_page( test_url );
    });

    describe("CruxConfig",	client_tests );
    describe("Errors",		errors_tests );

    after(async () => {
	server.close();
	await page.close();
	await browser.close();

	// setTimeout( () => why(), 1000 );
    });

});
