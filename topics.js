(function () {
  const createTopic = (keyword) => {
    const $li = document.createElement('li');
    const $text = document.createTextNode(keyword);
    const $button = document.createElement('button');
    $li.className = "topic-tag-action f6 float-left js-tag-input-tag";
    $button.className = "delete-topic-button f5 no-underline ml-2 js-remove";
    $button.setAttribute('tabIndex', '-1');
    $button.innerHTML = '×';
    $input = document.createElement("input");
    $input.name = "repo_topics[]"
    $input.value = keyword;
    $input.hidden = true;
    $li.appendChild($text);
    $li.appendChild($button);
    $li.appendChild($input);
    return $li;
  }
  const handleSyncClicked = (jsonPath, evt) => {
    evt.preventDefault();
    jsonPath = jsonPath.replace("github", "raw.githubusercontent").replace("/blob", "");
    fetch(jsonPath).then(d => {
      d.json().then(data => {
        const {keywords} = data;
        document.querySelector(".btn-link.js-repo-topics-form-toggle.js-details-target").click();
        let interval;
        const check = () => {
          $formUl = document.querySelector("#repo-topics-edit-form .js-tag-input-selected-tags");
          console.log($formUl);
          if (!$formUl) return;
          clearInterval(interval);
          keywords.forEach(keyword => {
            $formUl.appendChild(createTopic(keyword));
          });
          // $form.submit();
        }
        interval = setInterval(check, 1000)
      })
    })
  }

  const onStateChange = () => {
    const $topics = document.querySelector("#topics-list-container");
    const $topicsSync = document.getElementById("topics-sync");
    if (!$topics || $topicsSync) return;
    const isEditable = $topics.querySelector("button.js-repo-topics-form-toggle");
    const jsonFile = document.querySelector(".file-wrap .files td span a[title='package.json']");
    if (isEditable && jsonFile) {
      const $sync = document.createElement("button");
      $sync.id = "topics-sync";
      $sync.className = "btn-link bth-sync";
      $sync.innerHTML = "Fetch from package.json";
      $topics.appendChild($sync);
      $sync.addEventListener("click", handleSyncClicked.bind(null, jsonFile.href));
    }
  }

  const observer = new MutationObserver(function(mutations){
    const formChanged = mutations.some(mutation => {
      const added = Array.from(mutation.addedNodes).some(node => {
        return node.classList && node.classList.contains('js-topic-form-area');
      });
      const removed = Array.from(mutation.removedNodes).some(node => {
        return node.classList && node.classList.contains('js-topic-form-area');
      });
      return added || removed;
    });
    const $topicsSync = document.getElementById("topics-sync");

    if (formChanged && !$topicsSync) {
      onStateChange();
    }
  });
  const $topicsContainer = document.querySelector('.js-repository-topics-container');
  observer.observe($topicsContainer, { attributes: true, childList: true, characterData: true });

  onStateChange();
})()
