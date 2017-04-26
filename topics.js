(function() {
  const createTopic = keyword => {
    const $li = document.createElement('li');
    $li.className = 'topic-tag-action f6 float-left js-tag-input-tag';
    const $button = document.createElement('button');
    $button.className = 'delete-topic-button f5 no-underline ml-2 js-remove';
    $button.tabIndex = -1;
    $button.textContent = '×';
    const $input = document.createElement('input');
    $input.name = 'repo_topics[]';
    $input.value = keyword;
    $input.hidden = true;
    $li.append(keyword, $button, $input);
    return $li;
  };
  const handleSyncClicked = (jsonPath, evt) => {
    evt.preventDefault();
    jsonPath = jsonPath
      .replace('github', 'raw.githubusercontent')
      .replace('/blob', '');
    fetch(jsonPath).then(r => r.json()).then(({ keywords }) => {
      document
        .querySelector('.btn-link.js-repo-topics-form-toggle.js-details-target')
        .click();
      if (!keywords || !keywords.length) return;

      const check = () => {
        const $formUl = document.querySelector('.js-tag-input-selected-tags');
        if (!$formUl) return;

        const formValues = Array.from(
          $formUl.querySelectorAll('input'),
          input => input.value
        );
        const topics = keywords
          .filter(kw => !formValues.includes(kw))
          .map(createTopic);
        $formUl.append(...topics);

        clearInterval(interval);
        // $form.submit();
      };

      const interval = setInterval(check, 1000);
    });
  };

  const onStateChange = ($topics, $addTopics, $jsonFile) => {
    if (!$topics) {
      $topics = document.querySelector('#topics-list-container');
    }
    const $topicsSync = document.getElementById('topics-sync');
    if (!$topics || $topicsSync) return;

    if (!$addTopics) {
      $addTopics = $topics.querySelector('button.js-repo-topics-form-toggle');
    }
    if (!$jsonFile) {
      $jsonFile = document.querySelector(
        ".file-wrap .files td span a[title='package.json']"
      );
    }
    if ($addTopics && $jsonFile) {
      const $sync = document.createElement('button');
      $sync.id = 'topics-sync';
      $sync.className = 'btn-link bth-sync';
      $sync.textContent = 'Fetch from package.json';
      $topics.append($sync);
      $sync.addEventListener(
        'click',
        handleSyncClicked.bind(null, $jsonFile.href)
      );
    }
  };

  const $topics = document.querySelector('#topics-list-container');
  const $addTopics = $topics.querySelector('button.js-repo-topics-form-toggle');
  const $jsonFile = document.querySelector(
    ".file-wrap .files td span a[title='package.json']"
  );

  if ($addTopics && $jsonFile) {
    const observer = new MutationObserver(function(mutations) {
      const classChanged = mutations.every(mutation => {
        return (mutation.attributeName = 'class');
      });
      const $topicsSync = document.getElementById('topics-sync');
      if (classChanged && !$topicsSync) {
        onStateChange();
      }
    });
    observer.observe($topics, {
      attributes: true,
      childList: true,
      characterData: true
    });

    onStateChange($topics, $addTopics, $jsonFile);
  }
})();
