build:
	hugo --theme=tko -s src -d ../docs

serve:
	cd src; hugo --theme=tko server

