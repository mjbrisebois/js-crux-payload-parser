#
# Project
#
package-lock.json:	package.json
	npm install
	touch $@
node_modules:		package-lock.json
	npm install
	touch $@
build:			node_modules
use-npm-entity-architect:
	npm uninstall @whi/entity-architect
	npm i --save @whi/entity-architect
use-npm-essence:
	npm uninstall @whi/essence
	npm i --save @whi/essence
use-npm-holochain-client:
	npm uninstall @whi/holochain-client
	npm i --save @whi/holochain-client
use-npm-repr:
	npm uninstall @whi/repr
	npm i --save @whi/repr


#
# Testing
#
test:			test-unit test-e2e
test-debug:		test-unit-debug test-e2e-debug

test-unit:		build test-setup
	npx mocha ./tests/unit
test-unit-debug:	build test-setup
	LOG_LEVEL=silly npx mocha ./tests/unit

test-e2e:	build test-setup prepare-package
	npx mocha ./tests/e2e
test-e2e-debug:	build test-setup prepare-package
	LOG_LEVEL=silly npx mocha ./tests/e2e
test-setup:


#
# Repository
#
clean-remove-chaff:
	@find . -name '*~' -exec rm {} \;
clean-files:		clean-remove-chaff
	git clean -nd
clean-files-force:	clean-remove-chaff
	git clean -fd
clean-files-all:	clean-remove-chaff
	git clean -ndx
clean-files-all-force:	clean-remove-chaff
	git clean -fdx


#
# NPM
#
prepare-package:
	npm run build
	gzip -kf dist/*.js
preview-package:	clean-files test prepare-package
	npm pack --dry-run .
create-package:		clean-files test prepare-package
	npm pack .
publish-package:	clean-files test prepare-package
	npm publish --access public .
