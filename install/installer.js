let supportedOperatingSystems = ['linux', 'macos', 'windows'];
let supportedInterfaces = ['cmdstanpy', 'cmdstanr', 'cmdstan', 'pystan', 'rstan', 'stan.jl'];

const supportedInstallersMap = {
    "cmdstanpy": ["pip", "conda", "github-src"],
    "cmdstanr": ["runiverse", "github-src"],
    "cmdstan": ["github-rel", "conda", "github-src"],
    "pystan": ["pip", "conda", "github-src"],
    "rstan": ["cran", "runiverse", "github-src"],
    "stan.jl": ["julia-pkg", "github-src"],
    "": [], // mostly handles the case where a user had selected pystan then switches to windows
};

const cmdstanpyPostamble = `
<p>Then, in Python, run <code>import cmdstanpy; cmdstanpy.install_cmdstan()</code> or follow the conda instructions for CmdStan.</p>
<p>For more information, see the <a href="https://mc-stan.org/cmdstanpy/installation.html" target="_blank">CmdStanPy documentation</a>.</p>
`;
const cmdstanRPostamble = "<p>Then run <code>cmdstanr::install_cmdstan()</code></p>";

const instructions = {
    "cmdstanpy": {
        "pip": "Run <code>pip install cmdstanpy</code>" + cmdstanpyPostamble,
        "conda": "Run <code>conda install -c conda-forge cmdstanpy</code>",
        "github-src": "Run <code>pip install -e git+https://github.com/stan-dev/cmdstanpy@develop#egg=cmdstanpy</code>" + cmdstanpyPostamble,
    },
    "cmdstanr": {
        "runiverse": "In R, run <code>install.packages(\"cmdstanr\", repos = c('https://stan-dev.r-universe.dev', getOption(\"repos\")))</code>" + cmdstanRPostamble,
        "github-src": "In R, run <code>remotes::install_github(\"stan-dev/cmdstanr\")</code>" + cmdstanRPostamble,
    },
    "cmdstan": {
        "github-rel": "install from github release binary.tgz",
        "conda": "Run <code>conda install -c conda-forge cmdstan</code>",
        "github-src": "install from github release src.tgz",
    },
    "pystan": {
        "pip": "Run <code>pip install pystan</code>",
        "conda": "Run <code>conda install -c conda-forge pystan</code>",
    }
    // TODO: more
}

const prerequisites = {
    "linux": "Stan requires a C++17 compiler. On .deb based distros, <code>sudo apt-get install build-essential</code> will install what you need.",
    "macos": "Stan requires a C++17 compiler. We recommend installing Xcode from the App Store and then run <code>xcode-select --install</code>.",
    "windows": "Stan requires a C++17 compiler and some additional tools for building. We recommend RTools TODO",
};

const osToTitle = {
    "linux": "Linux",
    "macos": "macOS",
    "windows": "Windows",
};

const interfaceToTitle = {
    "cmdstanpy": "CmdStanPy",
    "cmdstanr": "CmdStanR",
    "cmdstan": "CmdStan",
    "pystan": "PyStan",
    "rstan": "RStan",
    "stan.jl": "Stan.jl",
};

const installerToTitle = {
    "pip": "pip",
    "conda": "conda",
    "github-src": "GitHub (Source)",
    "github-rel": "GitHub (Release)",
    "cran": "CRAN",
    "runiverse": "R-Universe",
    "julia-pkg": "Pkg.jl",
};

let opts = {
    os: getDefaultSelectedOS(),
    interface: 'cmdstan',
    installer: 'github-src',
};
let supportedInstallers = supportedInstallersMap[opts.interface];


function getDefaultSelectedOS() {
    const platform = navigator.platform.toLowerCase();
    for (const os of supportedOperatingSystems) {
        if (platform.indexOf(os) !== -1) {
            return os;
        }
    }
    return 'linux';
}

function selectedOption(selection, category) {
    const options = document.querySelectorAll('.' + category);

    options.forEach(option => {
        option.classList.remove('selected');
        if (option.id === selection) {
            option.classList.add('selected');
        }
    });
    opts[category] = selection;
    updateInstructions();
}

function isOptionSet(category) {
    return opts[category] && opts[category] !== '';
}

function updateInstructions() {
    const prereq = prerequisites[opts.os];
    document.getElementById('prerequisites').innerHTML = prereq ?? "Prerequisites not available.";

    if (!isOptionSet('os') || !isOptionSet('interface') || !isOptionSet('installer')) {
        document.getElementById('command').innerText = "Please select interface and preferred package manager.";
        return;
    }


    const command = instructions[opts.interface]?.[opts.installer];
    document.getElementById('command').innerHTML = command ?? "Instructions not available.";
}

function updateInterfaceOptions() {
    document.querySelectorAll('.interface').forEach(option => {
        option.classList.remove('disabled');
        if (opts.os === 'windows' && option.id === 'pystan') {
            option.classList.add('disabled');
            if (option.classList.contains('selected')) {
                option.classList.remove('selected');
                opts.interface = '';
            }
        }
    });
}


function updateInstallerOptions() {
    // only show supported installers for the selected interface
    supportedInstallers = supportedInstallersMap[opts.interface];
    const gridDiv = document.getElementById('install-grid');
    gridDiv.children[2]?.remove();
    addRow('Installer', supportedInstallers);

    let found = false;
    document.querySelectorAll('.installer').forEach(option => {
        if (option.id === opts.installer) {
            option.classList.add('selected');
            found = true;
        }
    });

    if (!found) {
        opts.installer = '';
    }

}

function updateNeeded(category) {
    if (category === 'os') {
        updateInterfaceOptions();
        updateInstallerOptions();
    } else if (category === 'interface') {
        updateInstallerOptions();
    }

    updateInstructions();
}


function getTitle(category, str) {
    if (category === 'interface') {
        return interfaceToTitle[str];
    } else if (category === 'installer') {
        return installerToTitle[str];
    } else if (category === 'os') {
        return osToTitle[str];
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function addRow(label, items) {
    const row = document.createElement('div');
    row.classList.add('flex-grid');

    const category = label.toLowerCase();

    const rowLabel = document.createElement('div');
    rowLabel.classList.add('row-label');
    rowLabel.innerText = label;
    row.appendChild(rowLabel);

    for (const item of items) {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('option');
        itemDiv.classList.add('grid-item');
        itemDiv.classList.add('col');
        itemDiv.classList.add(category);
        itemDiv.id = item;
        itemDiv.innerText = getTitle(category, item);

        itemDiv.addEventListener('click', function () {
            if (this.classList.contains('disabled')) {
                return;
            }
            selectedOption(item, category);
            updateNeeded(category);
        });

        row.appendChild(itemDiv);
    }

    const gridDiv = document.getElementById('install-grid');
    gridDiv.appendChild(row);

}

// Draw grid and select defaults
document.addEventListener('DOMContentLoaded', function () {
    addRow('OS', supportedOperatingSystems);
    addRow('Interface', supportedInterfaces);
    addRow('Installer', supportedInstallers);

    updateInstructions();
    document.getElementById(opts.os).classList.add('selected');
    document.getElementById(opts.interface).classList.add('selected');
    document.getElementById(opts.installer).classList.add('selected');
});
