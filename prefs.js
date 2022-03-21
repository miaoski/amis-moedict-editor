function saveOptions(e) {
  e.preventDefault();
  browser.storage.sync.set({
    token:  document.querySelector("#token").value,
    myrepo: document.querySelector("#myrepo").value,
    branch: document.querySelector("#branch").value
  });
  document.querySelector('#msg').innerHTML = 'Saved!';
}

function restoreOptions() {
  function setCurrentChoice(result) {
    document.querySelector("#token").value  = result.token  || "ghp_";
    document.querySelector("#myrepo").value = result.myrepo || "g0v/amis-moedict";
    document.querySelector("#branch").value = result.branch || "master";
  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }

  let getting = browser.storage.sync.get();
  getting.then(setCurrentChoice, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
