default:
	quarto render

preview:
	quarto preview

.PHONY: test
test:
	npm test
