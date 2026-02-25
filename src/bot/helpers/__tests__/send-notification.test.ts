import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { sendTaskPerformers, sendManagers } from "../send-notification.js";
import {
  createMockContext,
  createMockTicket,
} from "./mocks.js";

describe("sendTaskPerformers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should successfully send notifications to all task performers", async () => {
    // Arrange
    const taskPerformers = ["user-1", "user-2", "user-3"];
    const ctx = createMockContext(taskPerformers, []);
    const ticket = createMockTicket();
    const text = "New ticket notification";

    // Act
    await sendTaskPerformers(
      { ctx: ctx as any, ticket },
      text,
    );

    // Assert
    expect(ctx.api!.sendMessage).toHaveBeenCalledTimes(3);
    expect(ctx.api!.sendMessage).toHaveBeenCalledWith("user-1", text, { reply_markup: undefined });
    expect(ctx.api!.sendMessage).toHaveBeenCalledWith("user-2", text, { reply_markup: undefined });
    expect(ctx.api!.sendMessage).toHaveBeenCalledWith("user-3", text, { reply_markup: undefined });

    expect(ctx.logger!.info).toHaveBeenCalledWith(
      expect.stringContaining("[sendTaskPerformers] Fetching task performers")
    );
    expect(ctx.logger!.info).toHaveBeenCalledWith(
      expect.stringContaining("Sending notifications to 3 task performer(s)")
    );
    expect(ctx.logger!.info).toHaveBeenCalledWith(
      expect.stringContaining("3 sent successfully, 0 failed")
    );
  });

  it("should throw error when ticket has no category", async () => {
    // Arrange
    const ctx = createMockContext(["user-1"], []);
    const ticket = createMockTicket({ ticket_category: undefined });
    const text = "Test notification";

    // Act & Assert
    await expect(
      sendTaskPerformers({ ctx: ctx as any, ticket }, text)
    ).rejects.toThrow("Category not found");

    expect(ctx.logger!.error).toHaveBeenCalledWith(
      expect.stringContaining("Category ID not found")
    );
  });

  it("should throw error when session has no categories", async () => {
    // Arrange
    const ctx = createMockContext(["user-1"], []);
    ctx.session!.categories = undefined as any;
    const ticket = createMockTicket();
    const text = "Test notification";

    // Act & Assert
    await expect(
      sendTaskPerformers({ ctx: ctx as any, ticket }, text)
    ).rejects.toThrow("Category not found in session");

    expect(ctx.logger!.error).toHaveBeenCalledWith(
      expect.stringContaining("Categories not loaded in session")
    );
  });

  it("should throw error when category service fails", async () => {
    // Arrange
    const ctx = createMockContext(["user-1"], []);
    const ticket = createMockTicket();
    const text = "Test notification";
    const error = new Error("Network error");

    ctx.services!.Category.getUnique = vi.fn().mockRejectedValue(error);

    // Act & Assert
    await expect(
      sendTaskPerformers({ ctx: ctx as any, ticket }, text)
    ).rejects.toThrow("Failed to fetch category");

    expect(ctx.logger!.error).toHaveBeenCalledWith(
      expect.stringContaining("Failed to fetch category cat-1")
    );
  });

  it("should throw error when no task performers found", async () => {
    // Arrange
    const ctx = createMockContext([], []); // Empty task performers array
    const ticket = createMockTicket();
    const text = "Test notification";

    // Act & Assert
    await expect(
      sendTaskPerformers({ ctx: ctx as any, ticket }, text)
    ).rejects.toThrow("Not found taskPerformerIds");

    expect(ctx.logger!.warn).toHaveBeenCalledWith(
      expect.stringContaining("No task performers found")
    );
  });

  it("should log error when sending to specific performer fails", async () => {
    // Arrange
    const taskPerformers = ["user-1", "user-2", "user-3"];
    const ctx = createMockContext(taskPerformers, []);
    const ticket = createMockTicket();
    const text = "Test notification";

    // Mock sendMessage to fail for user-2
    ctx.api!.sendMessage = vi.fn()
      .mockResolvedValueOnce({ message_id: 1 }) // user-1 success
      .mockRejectedValueOnce(new Error("User blocked the bot")) // user-2 fails
      .mockResolvedValueOnce({ message_id: 3 }); // user-3 success

    // Act
    await sendTaskPerformers({ ctx: ctx as any, ticket }, text);

    // Assert
    expect(ctx.api!.sendMessage).toHaveBeenCalledTimes(3);
    expect(ctx.logger!.error).toHaveBeenCalledWith(
      expect.stringContaining("Failed to send notification to task performer user-2")
    );
    expect(ctx.logger!.info).toHaveBeenCalledWith(
      expect.stringContaining("2 sent successfully, 1 failed")
    );
  });

  it("should log critical error when all notifications fail", async () => {
    // Arrange
    const taskPerformers = ["user-1", "user-2"];
    const ctx = createMockContext(taskPerformers, []);
    const ticket = createMockTicket();
    const text = "Test notification";

    // Mock all sendMessage calls to fail
    ctx.api!.sendMessage = vi.fn().mockRejectedValue(new Error("Network error"));

    // Act
    await sendTaskPerformers({ ctx: ctx as any, ticket }, text);

    // Assert
    expect(ctx.logger!.error).toHaveBeenCalledWith(
      expect.stringContaining("All notifications failed")
    );
  });

  it("should include markup when provided", async () => {
    // Arrange
    const taskPerformers = ["user-1"];
    const ctx = createMockContext(taskPerformers, []);
    const ticket = createMockTicket();
    const text = "Test notification";
    const markup = { inline_keyboard: [[{ text: "View", callback_data: "view_1" }]] } as any;

    // Act
    await sendTaskPerformers({ ctx: ctx as any, ticket }, text, markup);

    // Assert
    expect(ctx.api!.sendMessage).toHaveBeenCalledWith("user-1", text, { reply_markup: markup });
  });
});

describe("sendManagers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should successfully send notifications to all managers", async () => {
    // Arrange
    const managers = ["manager-1", "manager-2"];
    const ctx = createMockContext([], managers);
    const ticket = createMockTicket();
    const text = "Ticket update notification";

    // Act
    await sendManagers({ ctx: ctx as any, ticket }, text);

    // Assert
    expect(ctx.api!.sendMessage).toHaveBeenCalledTimes(2);
    expect(ctx.api!.sendMessage).toHaveBeenCalledWith("manager-1", text, { reply_markup: undefined });
    expect(ctx.api!.sendMessage).toHaveBeenCalledWith("manager-2", text, { reply_markup: undefined });

    expect(ctx.logger!.info).toHaveBeenCalledWith(
      expect.stringContaining("[sendManagers] Fetching managers")
    );
    expect(ctx.logger!.info).toHaveBeenCalledWith(
      expect.stringContaining("Sending notifications to 2 manager(s)")
    );
    expect(ctx.logger!.info).toHaveBeenCalledWith(
      expect.stringContaining("2 sent successfully, 0 failed")
    );
  });

  it("should throw error when petrol station ID is missing", async () => {
    // Arrange
    const ctx = createMockContext([], ["manager-1"]);
    const ticket = createMockTicket({ petrol_station_id: undefined as any });
    const text = "Test notification";

    // Act & Assert
    await expect(
      sendManagers({ ctx: ctx as any, ticket }, text)
    ).rejects.toThrow("Petrol station ID not found");

    expect(ctx.logger!.error).toHaveBeenCalledWith(
      expect.stringContaining("Petrol station ID not found")
    );
  });

  it("should throw error when petrol station service fails", async () => {
    // Arrange
    const ctx = createMockContext([], ["manager-1"]);
    const ticket = createMockTicket();
    const text = "Test notification";
    const error = new Error("Database connection failed");

    ctx.services!.PetrolStation.getUnique = vi.fn().mockRejectedValue(error);

    // Act & Assert
    await expect(
      sendManagers({ ctx: ctx as any, ticket }, text)
    ).rejects.toThrow("Failed to fetch petrol station");

    expect(ctx.logger!.error).toHaveBeenCalledWith(
      expect.stringContaining("Failed to fetch petrol station ps-1")
    );
  });

  it("should throw error when no managers found", async () => {
    // Arrange
    const ctx = createMockContext([], []); // Empty managers array
    const ticket = createMockTicket();
    const text = "Test notification";

    // Act & Assert
    await expect(
      sendManagers({ ctx: ctx as any, ticket }, text)
    ).rejects.toThrow("Managers not found");

    expect(ctx.logger!.warn).toHaveBeenCalledWith(
      expect.stringContaining("No managers found")
    );
  });

  it("should handle partial failures gracefully", async () => {
    // Arrange
    const managers = ["manager-1", "manager-2", "manager-3"];
    const ctx = createMockContext([], managers);
    const ticket = createMockTicket();
    const text = "Test notification";

    // Mock sendMessage with mixed results
    ctx.api!.sendMessage = vi.fn()
      .mockResolvedValueOnce({ message_id: 1 }) // manager-1 success
      .mockRejectedValueOnce(new Error("Blocked")) // manager-2 fails
      .mockResolvedValueOnce({ message_id: 3 }); // manager-3 success

    // Act
    await sendManagers({ ctx: ctx as any, ticket }, text);

    // Assert
    expect(ctx.api!.sendMessage).toHaveBeenCalledTimes(3);
    expect(ctx.logger!.error).toHaveBeenCalledWith(
      expect.stringContaining("Failed to send notification to manager manager-2")
    );
    expect(ctx.logger!.info).toHaveBeenCalledWith(
      expect.stringContaining("2 sent successfully, 1 failed")
    );
  });

  it("should log critical error when all manager notifications fail", async () => {
    // Arrange
    const managers = ["manager-1", "manager-2"];
    const ctx = createMockContext([], managers);
    const ticket = createMockTicket();
    const text = "Test notification";

    // Mock all sendMessage calls to fail
    ctx.api!.sendMessage = vi.fn().mockRejectedValue(new Error("Bot was kicked"));

    // Act
    await sendManagers({ ctx: ctx as any, ticket }, text);

    // Assert
    expect(ctx.logger!.error).toHaveBeenCalledWith(
      expect.stringContaining("All notifications failed")
    );
  });

  it("should include markup when provided", async () => {
    // Arrange
    const managers = ["manager-1"];
    const ctx = createMockContext([], managers);
    const ticket = createMockTicket();
    const text = "Test notification";
    const markup = { inline_keyboard: [[{ text: "Approve", callback_data: "approve_1" }]] } as any;

    // Act
    await sendManagers({ ctx: ctx as any, ticket }, text, markup);

    // Assert
    expect(ctx.api!.sendMessage).toHaveBeenCalledWith("manager-1", text, { reply_markup: markup });
  });
});
