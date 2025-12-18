default:
	quarto render

preview:
	quarto preview

img: dataset.svg

dataset.svg: dataset.puml
	npm run plantuml -- $< --svg

.PHONY: test
test:
	npm test
