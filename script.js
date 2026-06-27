// ==========================================================================
// Theme Management
// ==========================================================================
const initTheme = () => {
  const themeToggle = document.getElementById('theme-toggle');
  if (!themeToggle) return;

  const currentTheme = localStorage.getItem('theme') || 'dark';
  document.body.setAttribute('data-theme', currentTheme);

  themeToggle.addEventListener('click', () => {
    const newTheme = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });
};

// ==========================================================================
// Mobile Menu
// ==========================================================================
const initMobileMenu = () => {
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.getElementById('nav-links');
  
  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }
};

// ==========================================================================
// Projects Filter (Projects Page)
// ==========================================================================
const initProjectsFilter = () => {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projects = document.querySelectorAll('.project-card');
  
  if (filterBtns.length === 0 || projects.length === 0) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projects.forEach(project => {
        if (filterValue === 'all' || project.getAttribute('data-category') === filterValue) {
          project.style.display = 'block';
          setTimeout(() => { project.style.opacity = '1'; }, 50);
        } else {
          project.style.opacity = '0';
          setTimeout(() => { project.style.display = 'none'; }, 300);
        }
      });
    });
  });
};

// ==========================================================================
// Academic Planner (Planner Page)
// ==========================================================================
const initPlanner = () => {
  const taskForm = document.getElementById('task-form');
  const taskList = document.getElementById('task-list');
  const taskInput = document.getElementById('task-input');
  
  if (!taskForm || !taskList) return;

  // Load tasks from localStorage
  let tasks = JSON.parse(localStorage.getItem('academic_tasks')) || [];

  const saveTasks = () => {
    localStorage.setItem('academic_tasks', JSON.stringify(tasks));
  };

  const renderTasks = () => {
    taskList.innerHTML = '';
    
    // Update stats
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const statTotal = document.getElementById('stat-total');
    const statCompleted = document.getElementById('stat-completed');
    
    if (statTotal) statTotal.textContent = totalTasks;
    if (statCompleted) statCompleted.textContent = completedTasks;

    if (tasks.length === 0) {
      taskList.innerHTML = '<p style="text-align:center; color: var(--text-secondary); padding: 2rem;">No tasks yet. Add one above!</p>';
      return;
    }

    tasks.forEach((task, index) => {
      const li = document.createElement('li');
      li.className = `task-item glass-card ${task.completed ? 'completed' : ''}`;
      li.style.padding = '1rem 1.5rem';
      li.style.marginBottom = '1rem';
      li.style.display = 'flex';
      li.style.justifyContent = 'space-between';
      li.style.alignItems = 'center';

      li.innerHTML = `
        <div class="task-content" style="display:flex; align-items:center; gap:1rem;">
          <input type="checkbox" class="task-check" ${task.completed ? 'checked' : ''} data-index="${index}" style="width:1.2rem; height:1.2rem; cursor:pointer;">
          <span style="font-size: 1.1rem; ${task.completed ? 'text-decoration: line-through; color: var(--text-secondary);' : ''}">${task.title}</span>
        </div>
        <button class="btn btn-outline delete-btn" data-index="${index}" style="padding: 0.4rem 0.8rem; border-color: var(--error-color); color: var(--error-color);">Delete</button>
      `;
      taskList.appendChild(li);
    });

    // Add event listeners to new elements
    document.querySelectorAll('.task-check').forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        const index = e.target.getAttribute('data-index');
        tasks[index].completed = e.target.checked;
        saveTasks();
        renderTasks();
      });
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = e.target.getAttribute('data-index');
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
      });
    });
  };

  taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = taskInput.value.trim();
    if (title) {
      tasks.push({ title, completed: false });
      taskInput.value = '';
      saveTasks();
      renderTasks();
    }
  });

  renderTasks();
};

// ==========================================================================
// Contact Form Validation (Contact Page)
// ==========================================================================
const initContactForm = () => {
  const contactForm = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');
  
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    formFeedback.style.display = 'none';
    formFeedback.className = 'form-feedback';

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const message = document.getElementById('message').value.trim();

    let errors = [];

    // Validation Rules
    if (!name || !email || !phone || !message) {
      errors.push("No field can be empty.");
    }
    
    // Email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      errors.push("Please enter a valid email address.");
    }

    // Phone regex (digits only)
    const phoneRegex = /^\d+$/;
    if (phone && !phoneRegex.test(phone)) {
      errors.push("Phone number must contain only digits.");
    }

    if (errors.length > 0) {
      formFeedback.innerHTML = errors.join('<br>');
      formFeedback.style.display = 'block';
      formFeedback.style.color = 'var(--error-color)';
      formFeedback.style.padding = '1rem';
      formFeedback.style.border = '1px solid var(--error-color)';
      formFeedback.style.borderRadius = '8px';
      formFeedback.style.marginTop = '1rem';
    } else {
      // Success
      formFeedback.innerHTML = 'Message sent successfully!';
      formFeedback.style.display = 'block';
      formFeedback.style.color = 'var(--success-color)';
      formFeedback.style.padding = '1rem';
      formFeedback.style.border = '1px solid var(--success-color)';
      formFeedback.style.borderRadius = '8px';
      formFeedback.style.marginTop = '1rem';
      contactForm.reset();
    }
  });
};

// ==========================================================================
// Initialize All
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileMenu();
  initProjectsFilter();
  initPlanner();
  initContactForm();
});
