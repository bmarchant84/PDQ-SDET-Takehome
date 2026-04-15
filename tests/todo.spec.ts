// Add a couple written (not coded) test cases using the test requirements listed in the README.md file.
/**
 * TEST CASE 1: Verification of Counter Logic on Item Deletion
 * ------------------------------------------------------------------
 * Requirement: The "items left" counter must accurately reflect active items.
 * Steps:
 * 1. Add "Task 1" and "Task 2". Verify counter is "2".
 * 2. Delete "Task 1".
 * Expected Result: Counter updates to "1".
 * Actual Result (BUG): Counter remains at "2".
 */

/**
 * TEST CASE 2: Verification of Counter Logic on Item Completion
 * ------------------------------------------------------------------
 * Requirement: Marking an item as completed should reduce the active count.
 * Steps:
 * 1. Add "Task 1" and "Task 2". Verify counter is "2".
 * 2. Check the toggle for "Task 1".
 * Expected Result: Counter updates to "1".
 * Actual Result (BUG): Counter remains at "2".
 */

/**
 * TEST CASE 3: Verification of Character Input Logic (The "P" Key Bug)
 * ------------------------------------------------------------------
 * Requirement: Only 'Enter' should trigger todo creation.
 * Steps:
 * 1. Type the word "Person" into the input field.
 * Expected Result: All letters appear; todo created only on 'Enter'.
 * Actual Result (BUG): 'P' key triggers immediate submission.
 */

import { test, expect } from '@playwright/test';
import { TodoPage } from '../pages/todoPage';

/*
Performance Budget: 
Initial page load ≤ 2 seconds.
Bundle size ≤ 250 KB.
Adding a todo ≤ 200 ms.
*/

test('innitial page load performance test', async ({ page, context }) => {
  try {
    await page.goto('http://127.0.0.1:7002');
  } catch (error) {
    throw new Error('Failed to visit local server. You may not have it running');
  }
})

test('adding a todo performance test', async ({page }) => {
  try {
    await page.goto('http://127.0.0.1:7002');
  } catch (error) {
    throw new Error('Failed to visit local server. You may not have it running');
  }
})

test.describe("Ben's PDQ Take Home Tests", () => {
  let todoPage: TodoPage;

  test.beforeEach(async ({ page }) => {
    todoPage = new TodoPage(page);
    await todoPage.goto();
  });

  test('should add a new todo item', async () => {
    await todoPage.addTodo('Buy groceries');
    await expect(todoPage.todoListItems).toHaveText('Buy groceries');
  });

  test('should mark a todo item as completed', async () => {
    await todoPage.addTodo('Walk the dog');
    await todoPage.markAsCompleted('Walk the dog');
    const row = todoPage.todoListItems.filter({ hasText: 'Walk the dog' });
    await expect(row.getByRole('checkbox')).toBeChecked();
  });

  test('should delete a todo item', async () => {
    await todoPage.addTodo('Read a book');
    await todoPage.deleteTodo('Read a book');
    await expect(todoPage.todoListItems.filter({ hasText: 'Read a book' })).toBeHidden();
  });

  test('should clear completed todo items', async () => {
    await todoPage.addTodo('Write tests');
    await todoPage.markAsCompleted('Write tests');
    await todoPage.clearCompleted();
    await expect(todoPage.todoListItems.filter({ hasText: 'Write tests' })).toBeHidden();
  });

  test('should filter by active todos', async () => {
    await todoPage.addTodo('Active task');
    await todoPage.addTodo('Completed task');
    await todoPage.markAsCompleted('Completed task');
    await todoPage.filterBy('Active');
    await expect(todoPage.todoListItems).toHaveText('Active task');
    await expect(todoPage.todoListItems).not.toHaveText('Completed task');
  });

  test('should filter by completed todos', async () => {
    await todoPage.addTodo('Active task');
    await todoPage.addTodo('Completed task');
    await todoPage.markAsCompleted('Completed task');
    await todoPage.filterBy('Completed');
    await expect(todoPage.todoListItems).toHaveText('Completed task');
    await expect(todoPage.todoListItems).not.toHaveText('Active task');
  });

  test('should filter by all todos', async () => {
    await todoPage.addTodo('Active task');
    await todoPage.addTodo('Completed task');
    await todoPage.markAsCompleted('Completed task');
    await todoPage.filterBy('All');
    await expect(todoPage.todoListItems.filter({ hasText: 'Active task' })).toBeVisible();
    await expect(todoPage.todoListItems.filter({ hasText: 'Completed task' })).toBeVisible();
  });

  test('Should allow the letter P to be typed as part of a word', async () => {
    test.fail(true, 'https://github.com/bmarchant84/PDQ-SDET-Takehome/issues/3');

    await todoPage.inputBox.pressSequentially('Apple');
    await expect(todoPage.todoListItems).toHaveText('Apple');
  });

  test('Todo items left counter should update correctly', async () => {
    test.fail(true, 'https://github.com/bmarchant84/PDQ-SDET-Takehome/issues/2');

    await todoPage.addTodo('Task 1');
    await todoPage.addTodo('Task 2');
    await expect(todoPage.todoCount).toContainText('2');

    await todoPage.markAsCompleted('Task 1');
    await expect(todoPage.todoCount).toContainText('1');

    await todoPage.markAsCompleted('Task 2');
    await expect(todoPage.todoCount).toContainText('0');
  });

  test("Deleting a todo doesn't update the items left counter", async () => {
    test.fail(true, 'https://github.com/bmarchant84/PDQ-SDET-Takehome/issues/1');

    await todoPage.addTodo('Task 1');
    await todoPage.addTodo('Task 2');
    await expect(todoPage.todoCount).toContainText('2');

    await todoPage.deleteTodo('Task 1');
    await expect(todoPage.todoCount).toContainText('1');
  });
});

