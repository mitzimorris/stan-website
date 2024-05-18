var supportedOperatingSystems = ['linux', 'macos', 'windows', 'colab'];
var supportedInterfaces = ['stan.jl', 'cmdstanpy', 'cmdstanr', 'cmdstan', 'pystan', 'rstan'];
var supportedInstallers = ['julia-pkg', 'conda', 'cran', 'github-bin', 'pip', 'runiverse', 'github-src'];

var opts = {
    os: getDefaultSelectedOS(),
    interface: 'cmdstan',
    installer: 'github-bin',
};

var osOptions = document.querySelectorAll('.os');
var interfaceOptions = document.querySelectorAll('.interface');
var installerOptions = document.querySelectorAll('.installer');

osOptions.forEach(option => {
    option.addEventListener('click', function() {
        selectedOption(osOptions, this, 'os');
    });
});

interfaceOptions.forEach(option => {
    option.addEventListener('click', function() {
        selectedOption(interfaceOptions, this, 'interface');
    });
});

installerOptions.forEach(option => {
    option.addEventListener('click', function() {
        selectedOption(installerOptions, this, 'installer');
    });
});

function getDefaultSelectedOS() {
    var platform = navigator.platform.toLowerCase();
    for (var os of supportedOperatingSystems) {
        if (platform.indexOf(os) !== -1) {
            return os;
        }
    }
    return 'linux';
}

function selectedOption(options, selection, category) {
    options.forEach(option => {
        option.classList.remove('selected');
    });
    selection.classList.add('selected');
    opts[category] = selection.id;
    updateCommandMessage();
}

function updateCommandMessage() {
    var key = opts.os + "," + opts.interface + "," + opts.installer;
    var commands = {
        "colab,cmdstan,github-src": "install from github release src.tgz",
        "colab,cmdstan,github-bin": "install from github release binary.tgz",
        "colab,cmdstanr,cran": "install.packages('cmdstanr', repos = c('https://mc-stan.org/r-packages/', getOption('repos')))",
        "colab,cmdstanpy,pip": "pip install cmdstanpy",
        "colab,pystan,pip": "pip install pystan",
        "colab,rstan,cran": "install.packages('rstan')",
        "linux,stan.jl,julia-pkg": "using Pkg; Pkg.add('Stan')",
        "linux,cmdstan,github-src": "install from github release src.tgz",
        "linux,cmdstan,github-bin": "install from github release binary.tgz",
        "linux,cmdstanpy,pip": "pip install cmdstanpy",
        "linux,cmdstanpy,conda": "conda install cmdstanpy",
        "linux,cmdstanr,cran": "install.packages('cmdstanr', repos = c('https://mc-stan.org/r-packages/', getOption('repos')))",
        "linux,pystan,pip": "pip install pystan",
        "linux,rstan,cran": "install.packages('rstan')",
        "macos,stan.jl,julia-pkg": "using Pkg; Pkg.add('Stan')",
        "macos,cmdstan,github-src": "install from github release src.tgz",
        "macos,cmdstanpy,pip": "pip install cmdstanpy",
        "macos,cmdstanpy,conda": "conda install cmdstanpy",
        "macos,cmdstanr,cran": "install.packages('cmdstanr', repos = c('https://mc-stan.org/r-packages/', getOption('repos')))",
        "macos,pystan,pip": "pip install pystan",
        "macos,rstan,cran": "install.packages('rstan')",
        "windows,stan.jl,julia-pkg": "using Pkg; Pkg.add('Stan')",
        "windows,cmdstan,github-src": "install from github release src.tgz",
        "windows,cmdstanr,cran": "install.packages('cmdstanr', repos = c('https://mc-stan.org/r-packages/', getOption('repos')))",
        "windows,cmdstanpy,pip": "pip install cmdstanpy",
        "windows,cmdstanpy,conda": "conda install cmdstanpy",
        "windows,rstan,cran": "install.packages('rstan')",
    };
    var command = commands[key];
    document.getElementById('command').innerText = command ? command : "Instructions not available.";
}

// Pre-select user's operating system
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById(opts.os).classList.add('selected');
    document.getElementById(opts.interface).classList.add('selected');
    document.getElementById(opts.installer).classList.add('selected');
    updateCommandMessage();
});
