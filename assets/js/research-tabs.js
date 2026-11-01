(() => {
  const tablist = document.querySelector('.research-tabs');
  if (!tablist) return;

  const tabs = Array.from(tablist.querySelectorAll('[role="tab"]'));
  const panels = tabs.map(tab => document.getElementById(tab.getAttribute('aria-controls')));

  function selectTab(id, updateHistory = false) {
    const selected = tabs.find(tab => tab.getAttribute('aria-controls') === id) || tabs[0];

    tabs.forEach((tab, index) => {
      const active = tab === selected;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      panels[index].hidden = !active;
      panels[index].setAttribute('role', 'tabpanel');
      panels[index].setAttribute('aria-labelledby', tab.id);
      panels[index].tabIndex = 0;
    });

    const hash = '#' + selected.getAttribute('aria-controls');
    if (updateHistory && window.location.hash !== hash) {
      window.history.pushState(null, '', hash);
    }
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectTab(tab.getAttribute('aria-controls'), true));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      else if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      else return;

      event.preventDefault();
      tabs[next].focus();
      selectTab(tabs[next].getAttribute('aria-controls'), true);
    });
  });

  window.addEventListener('hashchange', () => selectTab(window.location.hash.slice(1)));
  selectTab(window.location.hash.slice(1));
})();
