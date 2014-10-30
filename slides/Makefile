SLIDES=-t beamer --latex-engine=xelatex --smart --standalone

slides.pdf: slides.md
	pandoc $(SLIDES) -o $@ $<

slides.tex: slides.md
	pandoc $(SLIDES) -o $@ $<

.PHONY: clean

clean:
	rm -f *.aux *.log *.nav *.out *.snm *.toc

