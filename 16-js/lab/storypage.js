let story = {};
let currentPage = 0;

fetch("anabasis.json")
  .then(response => response.json())
  .then(data => {
    story = data;
    initialise();
  })
  .catch(error => console.error("Error loading story:", error));

function initialise() {
    document.title = story.title;
    document.querySelector("h1").textContent = story.title;
    const infopane = document.querySelector(".infopane");
    infopane.innerHTML = `<p><strong>Author:</strong> ${story.author}</p>
                            <p><strong>Translator:</strong> ${story.translator}</p>
                            <p>Page: <span id="page-num">1</span> / ${story.pages.length}</p>`;
    updatePage();
    document.getElementById("prev").addEventListener("click", prevPage);
    document.getElementById("next").addEventListener("click", nextPage);
    document.getElementById("dictform").addEventListener("submit", fetchDefinition);
}

function updatePage() {
    const pageElement = document.querySelector(".page");
    pageElement.innerHTML = story.pages[currentPage];
    document.getElementById("page-num").textContent = currentPage + 1;
    document.getElementById("prev").style.visibility = currentPage > 0 ? "visible" : "hidden";
    document.getElementById("next").style.visibility = currentPage < story.pages.length - 1 ? "visible" : "hidden";
}

function prevPage() {
    console.log("prevPage");
    if (currentPage > 0) {
      currentPage--;
      updatePage();
    }
}

function nextPage() {
    console.log("nextPage");
    if (currentPage < story.pages.length - 1) {
        currentPage++;
        updatePage();
    }
}

function fetchDefinition(event) {
    console.log("fetchDefinition");
    event.preventDefault();
    const word = document.getElementById("dictbox").value.trim();

    if (word === "") return;

    fetch(`/cgi-bin/whatmeans?term=${word}`)
        .then(response => response.text())
        .then(html => {
            document.getElementById("resultbox").innerHTML = html;
        })
        .catch(error => {
            console.error("Error fetching definition:", error);
            document.getElementById("resultbox").textContent = "Error fetching definition.";
        });
}
