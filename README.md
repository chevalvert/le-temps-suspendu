# le-temps-suspendu

* [setup](#setup)
    - [DMX](#dmx)
    - [OSX basic installation](#osx-basic-installation)
    - [OSX terminal, node etc](#osx-terminal-node-etc)
      * [:point_right: install XCode](#point_right-install-xcode)
      * [:point_right: install Homebrew](#point_right-install-homebrew)
      * [:point_right: install NodeJS](#point_right--install-nodejs)
        + [w/ `wget`](#w-wget)
        + [manually](#manually)
      * [:point_right: download & install Electron](#point_right-download--install-electron)
* [project installation](#project-installation)
* [project usage](#project-usage)

---

## setup

#### DMX
[:art: DMX setup guide](https://github.com/chevalvert/OSX-setup-guide-for-exhibitions/blob/master/DMX-macOS-setup-guide.md)

#### OSX basic installation
[:art: OSX setup guide for exhibitions](https://github.com/chevalvert/OSX-setup-guide-for-exhibitions)

#### OSX terminal, node, etc
##### :point_right: install XCode

```sh
xcode-select --install
```

##### :point_right: install Homebrew
```sh
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

##### :point_right:  install NodeJS
###### w/ `wget`
```sh
brew install wget
curl "https://nodejs.org/dist/latest/node-${VERSION:-$(wget -qO- https://nodejs.org/dist/latest/ | sed -nE 's|.*>node-(.*)\.pkg</a>.*|\1|p')}.pkg" > "$HOME/Downloads/node-latest.pkg" && sudo installer -store -pkg "$HOME/Downloads/node-latest.pkg" -target "/"
```

`node -v` should output the installed node version

###### manually 
Alternatively, you can manually donwload and install node from https://nodejs.org/en/download/</sup>

##### :point_right: download & install Electron
Download the last stable release for `darwin` from https://github.com/electron/electron/releases. 

Place the `Electron.app` in your `/Applications` folder

<sup>the file should be something like `electron-v1.7.3-darwin-x64.zip`</sup>


## project installation
```sh
git clone https://github.com/chevalvert/le-temps-suspendu.git
cd le-temps-suspendu
npm install
```

## project usage
Either open `Electron.app` and drag & drop the `le-temps-suspendu` in it, or :
```sh
/Applications/Electron.app/Contents/MacOS/Electron path/To/le-temps-suspendu
```
