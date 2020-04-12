build:
	hugo --theme=tko -s src -d ../dist

serve:
	cd src; hugo --theme=tko server

