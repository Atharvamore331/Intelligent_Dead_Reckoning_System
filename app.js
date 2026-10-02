(function () {
  const AUTH_KEY = 'intellidr_authenticated';

  function readUser() {
    try {
      return JSON.parse(localStorage.getItem(AUTH_KEY) || 'null');
    } catch {
      return null;
    }
  }

  function writeUser(value) {
    if (!value) {
      localStorage.removeItem(AUTH_KEY);
      return;
    }
    localStorage.setItem(AUTH_KEY, JSON.stringify(value));
  }

  function getFormValue(form, names) {
    for (const name of names) {
      const input = form.querySelector(`[name="${name}"]`);
      if (input && input.value.trim()) {
        return input.value.trim();
      }
    }
    return '';
  }

  function bindAuthForm() {
    const form = document.querySelector('[data-auth-form]');
    if (!form) return;

    const status = form.querySelector('[data-auth-status]');

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const identifier = getFormValue(form, ['identifier', 'admin-email', 'email', 'user', 'username']);
      const password = getFormValue(form, ['passcode', 'admin-password', 'password']);

      if (!identifier || !password) {
        if (status) {
          status.textContent = 'Please enter both your ID and password.';
          status.classList.remove('hidden');
        }
        return;
      }

      writeUser({ identifier, loggedInAt: Date.now() });

      const nextPage = form.dataset.redirect || './intellidr_admin_dashboard/code.html';
      window.location.href = nextPage;
    });
  }

  function bindRoutes() {
    document.querySelectorAll('[data-route]').forEach((button) => {
      button.addEventListener('click', () => {
        const target = button.dataset.route;
        if (target) {
          window.location.href = target;
        }
      });
    });

    document.querySelectorAll('[data-logout]').forEach((button) => {
      button.addEventListener('click', () => {
        writeUser(null);
        window.location.href = '../intellidr_user_login/code.html';
      });
    });
  }

  function updateAuthState() {
    const pageName = window.location.pathname.split('/').pop();
    const user = readUser();

    if (pageName === 'code.html' && (window.location.pathname.includes('/intellidr_admin_dashboard/') || window.location.pathname.includes('/intellidr_live_navigation/') || window.location.pathname.includes('/intellidr_fleet_analytics/') || window.location.pathname.includes('/intellidr_sensor_insights/'))) {
      if (!user) {
        window.location.href = '../intellidr_user_login/code.html';
      }
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    bindAuthForm();
    bindRoutes();
    updateAuthState();
  });
})();
