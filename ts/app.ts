import Util from './util.ts';
import * as $ from 'jquery';

const TODO_TEMPLATE = require('../handlebar/todo.hbs');
const FOOTER_TEMPLATE = require('../handlebar/footer.hbs');

const STORAGE_NAME = 'todos';
const ENTER_KEY = 13;
const ESCAPE_KEY = 27;

export default {
  init: function init() {
    this.todos = Util.store(STORAGE_NAME);
    console.log(this.todos);
    this.todoTemplate = TODO_TEMPLATE;
    this.footerTemplate = FOOTER_TEMPLATE;
    this.bindEvents();
  },
  bindEvents: function bindEvents() {
    $('#new-todo').on('keyup', this.create.bind(this));
    $('#toggle-all').on('change', this.toggleAll.bind(this));
    $('#todo-list')
      .on('change', '.toggle', this.toggle.bind(this))
      .on('dblclick', 'label', this.edit.bind(this))
      .on('keyup', '.edit', this.editKeyup.bind(this))
      .on('focusout', '.edit', this.update.bind(this))
      .on('click', '.destroy', this.destroy.bind(this));
    $('#footer').on('click', '#clear-completed', this.destroyCompleted.bind(this));
  },
  create: function create(e) {
    const $input = $(e.target);
    const val = $input.val().trim();
    if (e.which !== ENTER_KEY || !val) {
      return;
    }
    this.todos.push({
      id: Util.uuid(),
      title: val,
      completed: false
    });
    $input.val('');
    this.render();
  },
  toggleAll: function toggleAll(e) {
    const isChecked = $(e.target).prop('checked');
    this.todos.forEach((todo) => {
      todo.completed = isChecked;
    });
    this.render();
  },
  toggle: function toggle(e) {
    const i = this.indexFromEl(e.target);
    this.todos[i].completed = !this.todos[i].completed;
    this.render();
  },
  edit: function edit(e) {
    const $input = $(e.target).closest('li').addClass('editing').find('.edit');
    $input.val($input.val()).focus();
  },
  editKeyup: function editKeyup(e) {
    if (e.which === ENTER_KEY) {
      e.target.blur();
    }
    if (e.which === ESCAPE_KEY) {
      $(e.target).data('abort', true).blur();
    }
  },
  update: function update(e) {
    const el = e.target;
    const $el = $(el);
    const val = $el.val().trim();
    if (!val) {
      this.destroy(e);
      return;
    }
    if ($el.data('abort')) {
      $el.data('abort', false);
    } else {
      this.todos[this.indexFromEl(el)].title = val;
    }
    this.render();
  },
  destroy: function destroy(e) {
    this.todos.splice(this.indexFromEl(e.target), 1);
    this.render();
  },
  destroyCompleted: function destroyCompleted() {
    this.todos = this.getActiveTodos();
    this.filter = 'all';
    this.render();
  },

  render: function render() {
    const todos = this.getFilteredTodos();
    $('#todo-list').html(this.todoTemplate(todos));
    $('#main').toggle(todos.length > 0);
    $('#toggle-all').prop('checked', this.getActiveTodos().length === 0);
    this.renderFooter();
    $('#new-todo').focus();
    Util.store(STORAGE_NAME, this.todos);
  },
  getFilteredTodos: function getFilteredTodos() {
    if (this.filter === 'active') {
      return this.getActiveTodos();
    }
    if (this.filter === 'completed') {
      return this.getCompletedTodos();
    }
    return this.todos;
  },
  getActiveTodos: function getActiveTodos() {
    return this.todos.filter(todo => !todo.completed);
  },
  getCompletedTodos: function getCompletedTodos() {
    return this.todos.filter(todo => todo.completed);
  },
  renderFooter: function renderFooter() {
    const todoCount = this.todos.length;
    const activeTodoCount = this.getActiveTodos().length;
    const template = this.footerTemplate({
      activeTodoCount: activeTodoCount,
      activeTodoWord: Util.pluralize(activeTodoCount, 'item'),
      completedTodos: todoCount - activeTodoCount,
      filter: this.filter
    });
    $('#footer').toggle(todoCount > 0).html(template);
  },

  // accepts an element from inside the li and
  // returns the corresponding index in the `todos` array
  indexFromEl: function indexFromEl(el) {
    const id = $(el).closest('li').data('id');
    const todos = this.todos;
    let i = todos.length;
    while (i--) {
      if (todos[i].id === id) {
        return i;
      }
    }
    return -1;
  },
  filter: <string> ''
};
