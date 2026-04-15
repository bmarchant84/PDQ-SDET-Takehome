import { type Locator, type Page, expect } from '@playwright/test';

export class TodoPage {
  readonly page: Page;
  readonly inputBox: Locator;
  readonly todoListItems: Locator;
  readonly footer: Locator;
  readonly toggleAllArrow: Locator;
  readonly todoCount: Locator;

  constructor(page: Page) {
    this.page = page;
    this.inputBox = page.getByTestId('text-input');
    this.todoListItems = page.getByTestId('todo-item');
    this.footer = page.getByTestId('footer'); 
    this.toggleAllArrow = page.getByTestId('toggle-all');
    this.todoCount = this.footer.locator('.todo-count');
  }

  async goto() {
    await this.page.goto('http://127.0.0.1:7002');
  }

  async addTodo(text: string) {
    await this.inputBox.fill(text);
    await this.inputBox.press('Enter');
  }

  async markAsCompleted(todoText: string) {
    const row = this.todoListItems.filter({ hasText: todoText });
    await row.getByRole('checkbox').check();
  }

  async deleteTodo(todoText: string) {
    const row = this.todoListItems.filter({ hasText: todoText });
    await row.hover();
    await row.getByTestId('todo-item-button').click(); 
  }

  async clearCompleted() {
    await this.page.getByRole('button', { name: 'Clear completed' }).click();
  }

  async filterBy(status: 'All' | 'Active' | 'Completed') {
    await this.page.getByRole('link', { name: status }).click();
  }
}