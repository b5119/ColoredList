import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import supabase from "./supabaseClient.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Needed to resolve __dirname with ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from frontend folder
app.use(express.static(path.join(__dirname, "../frontend")));

// ✅ Default route (serve login page)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/login.html"));
});

// Serve home page (requires authentication)
app.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/home.html"));
});

// Serve dashboard page (alias for home)
app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/home.html"));
});

// Validation middleware
const validateListData = (req, res, next) => {
  const { name } = req.body;
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ error: "List name is required and must be a non-empty string" });
  }
  if (name.trim().length > 100) {
    return res.status(400).json({ error: "List name must be less than 100 characters" });
  }
  next();
};

const validateItemData = (req, res, next) => {
  const { item_name, list_id } = req.body;
  if (!item_name || typeof item_name !== 'string' || item_name.trim().length === 0) {
    return res.status(400).json({ error: "Item name is required and must be a non-empty string" });
  }
  if (!list_id || typeof list_id !== 'number') {
    return res.status(400).json({ error: "Valid list_id is required" });
  }
  next();
};

// Authentication routes
app.post("/auth/signup", async (req, res) => {
  try {
    const { email, password, username } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username || email.split('@')[0]
        }
      }
    });
    
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    
    res.status(201).json({ message: "User created successfully", user: data.user });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      return res.status(401).json({ error: error.message });
    }
    
    res.json({ message: "Login successful", session: data.session, user: data.user });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/auth/logout", async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    res.json({ message: "Logout successful" });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Test endpoint to check database structure in detail
app.get("/test-table-structure", async (req, res) => {
  try {
    const { data, error } = await supabase.from('lists').select('*').limit(1);
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    
    // Get column names from the data
    const columnInfo = {
      availableColumns: data && data[0] ? Object.keys(data[0]) : [],
      sampleRow: data && data[0] ? data[0] : null,
    };
    
    res.json(columnInfo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Test endpoint to check database structure
app.get("/test-db", async (req, res) => {
  try {
    // Test if tables exist by trying to query them
    const testQueries = [
      { table: 'lists', query: () => supabase.from('lists').select('*').limit(1) },
      { table: 'items', query: () => supabase.from('items').select('*').limit(1) }
    ];
    
    const results = {};
    
    for (const test of testQueries) {
      try {
        const { data, error } = await test.query();
        if (error) {
          results[test.table] = { error: error.message };
        } else {
          results[test.table] = { success: true, sample: data[0] || null };
        }
      } catch (err) {
        results[test.table] = { error: err.message };
      }
    }
    
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// List management routes
app.get("/lists", async (req, res) => {
  try {
    // Try with position column first, fallback to list_id ordering
    let { data, error } = await supabase
      .from("lists")
      .select("*")
      .order('position', { ascending: true });
    
    // If position column doesn't exist, try without it
    if (error && error.message && error.message.includes('position does not exist')) {
      console.log('Position column not found, using list_id ordering instead');
      const result = await supabase
        .from("lists")
        .select("*")
        .order('list_id', { ascending: true });
      data = result.data;
      error = result.error;
    }
    
    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ 
        error: error.message,
        help: "Please run the disable_rls_for_testing.sql script in your Supabase SQL Editor"
      });
    }
    
    console.log('Lists fetched:', data);
    res.json(data || []);
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/lists/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from("lists")
      .select("*")
      .eq("list_id", id)
      .single();
    
    if (error) {
      return res.status(404).json({ error: "List not found" });
    }
    
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/lists", validateListData, async (req, res) => {
  try {
    const { name } = req.body;
    
    // Start with minimal data - just the name
    const listData = {
      name: name.trim()
    };
    
    const { data, error } = await supabase
      .from("lists")
      .insert([listData])
      .select()
      .single();
    
    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ 
        error: error.message,
        help: "Database issue - check if lists table has the required columns"
      });
    }
    
    console.log('List created successfully:', data);
    res.status(201).json({ message: "List created successfully", list: data });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/lists/:id", validateListData, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, color, category, due_date } = req.body;
    
    const updateData = { name: name.trim() };
    if (color) updateData.color = color;
    if (category !== undefined) updateData.category = category;
    if (due_date !== undefined) updateData.due_date = due_date;
    
    const { data, error } = await supabase
      .from("lists")
      .update(updateData)
      .eq("list_id", id)
      .select()
      .single();
    
    if (error) {
      return res.status(404).json({ error: "List not found or update failed" });
    }
    
    res.json({ message: "List updated successfully", list: data });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/lists/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    // First delete all items in this list
    await supabase.from("items").delete().eq("list_id", id);
    
    // Then delete the list
    const { error } = await supabase.from("lists").delete().eq("list_id", id);
    
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    
    res.json({ message: "List deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/lists/reorder", async (req, res) => {
  try {
    const { reorderedLists } = req.body;
    
    if (!Array.isArray(reorderedLists)) {
      return res.status(400).json({ error: "reorderedLists must be an array" });
    }
    
    // Update positions in batch
    const updates = reorderedLists.map(async (item) => {
      const { list_id, position } = item;
      return supabase
        .from("lists")
        .update({ position })
        .eq("list_id", list_id);
    });
    
    await Promise.all(updates);
    
    res.json({ message: "Lists reordered successfully" });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Item management routes
app.get("/lists/:listId/items", async (req, res) => {
  try {
    const { listId } = req.params;
    const { data, error } = await supabase
      .from("items")
      .select("*")
      .eq("list_id", listId)
      .order('position', { ascending: true });
    
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    
    res.json(data || []);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/lists/:listId/items", validateItemData, async (req, res) => {
  try {
    const { listId } = req.params;
    const { item_name, color, due_date } = req.body;
    
    // Get the highest position for new item
    const { data: maxPosition } = await supabase
      .from("items")
      .select("position")
      .eq("list_id", listId)
      .order('position', { ascending: false })
      .limit(1);
    
    const newPosition = maxPosition && maxPosition.length > 0 ? maxPosition[0].position + 1 : 0;
    
    const { data, error } = await supabase
      .from("items")
      .insert([{ 
        item_name: item_name.trim(), 
        list_id: parseInt(listId),
        position: newPosition,
        color: color || '#5bc0de',
        due_date: due_date || null,
        completed: false
      }])
      .select()
      .single();
    
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    
    res.status(201).json({ message: "Item created successfully", item: data });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/items/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from("items").delete().eq("item_id", id);
    
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    
    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

