all: build build-compress

build:
	@wrup -r mobkit ./ > mobkit.js
	@echo "File written to 'mobkit.js'"

build-compress:
	@wrup -r mobkit ./ > mobkit.min.js --compress
	@echo "File written to 'mobkit.min.js'"

