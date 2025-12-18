default:
	quarto render

preview:
	quarto preview

img: types.svg dataset.svg

%.svg: %.puml
	npm run plantuml -- $< --svg

.PHONY: test
test:
	npm test
