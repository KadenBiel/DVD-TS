<p align="center">
    <a href="https://github.com/KadenBiel/DVD-TS">
        <img src="icon.ico" alt="Icon" width="75" height="54"></img>
    </a>
    <h2 align="center">DVD Screen</h2>
    <p align="center">
        Simple DVD screen program
        <br />
        <a href="https://github.com/KadenBiel/DVD-TS/issues">Report a bug</a>
        .
        <a href="#installation">Install/use instructions</a>
    </p>
</p>
<!-- Table of Contents -->
## Table of Contents

* [About](#about)
* [Installation](#installation)
* [Developement](#developement)
    * [Prerequisites](#prerequisites)
    * [Setup](#setup)
* [Contributing](#contributing)
* [License](#license)

<!-- About -->
## About

This project creates a replica of the DVD screen saver, which we all know and love. Not sure what you might want to use it for, maybe stream backgroud? Doesn't matter because its a fun little project for me to pass time.

<!-- Installation -->
## Installation

Download the latest version from [releases](https://github.com/KadenBiel/DVD-TS/releases) and run the `DVD_Setup-X.X.X.exe` file. You may get antivirus warnings, this is because I can't be bothered to sign my program.

<!-- Developement -->
## Developement

You'll only need the instructions below if you wish to contribute to this project, otherwise just follow the installation instructions above.

## Prequisites

These are the things you will need to install in order to start developing this project
* [Python](https://www.python.org/downloads/) 
* [node.js](https://nodejs.org/en/download/)
* yarn
```sh
npm install yarn -g
```
** Note that none of the project is written in python, however you will need it because some packages require it. If you are looking to develope in python, I have a [python version](https://github.com/KadenBiel/Dvd-Screen-Saver) that you may find equally as dumb.

## Setup

1. Clone your fork
```sh
git clone https://github.com/KadenBiel/DVD-TS.git
cd DVD-TS
```
2. Install all the packages
```sh
yarn install
```
3. Running the project
```sh
yarn dev
```

<!-- Contributing -->
## Contributing

Not sure how much anyone will be able to contribute, this is a simple program but all contributions are appreciated

1. Fork the repository
2. Create your branch (`git checkout -b feature/MyAmazingJavaScript`)
3. Commit changes (`git commit -m 'add my javascript'`)
4. Push to your branch (`git push origin feature/MyAmazingJavaScript`)
5. Open a pull request

<!-- License -->
## License

Distributed under the GNU General Public License v3.0. See `LICENSE` for more information.