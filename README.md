# ColoredLists - Enhanced Task Management Application

A modern, responsive task management application built with HTML, CSS, JavaScript, Node.js, Express, and Supabase. Organize your tasks with style using colors, categories, due dates, and more!

## ✨ Features

### 🎨 Core Features
- **Color-coded Lists & Tasks**: Assign custom colors to organize visually
- **Category Management**: Organize lists by categories (Work, Personal, Shopping, etc.)
- **Due Date Tracking**: Set and track due dates for lists and tasks
- **Drag & Drop Reordering**: Intuitive list and task reordering
- **Real-time Updates**: Live synchronization with the database
- **Mobile Responsive**: Works perfectly on desktop, tablet, and mobile devices

### 🔐 Authentication & Security
- **Complete User Authentication**: Secure signup/login with Supabase Auth
- **Session Management**: Persistent login sessions
- **Row Level Security**: Users can only access their own data
- **Password Management**: Change password functionality
- **Profile Management**: Update display names and user information

### 📱 User Experience
- **Modern UI Design**: Clean, professional interface with Bootstrap 5
- **Consistent Styling**: Unified design language across all pages
- **Interactive Feedback**: Status messages, hover effects, and smooth transitions
- **Accessibility**: Proper ARIA labels and keyboard navigation support
- **Cross-browser Compatible**: Works on all modern browsers

### ⚙️ Advanced Features
- **User Preferences**: Customizable default colors and categories
- **Notification Settings**: Email and browser notification preferences
- **Data Export**: Download all your data as JSON
- **Statistics Dashboard**: Track total lists, tasks, and account info
- **Settings Management**: Comprehensive user settings page

## 🗂️ Project Structure

```
ColoredList/
├── Backend/
│   ├── server.js              # Express server with comprehensive API
│   ├── supabaseClient.js      # Supabase configuration
│   ├── database_schema.sql    # Database setup and migrations
│   ├── package.json           # Backend dependencies
│   └── package-lock.json
├── frontend/
│   ├── home.html              # Main dashboard with authentication flow
│   ├── home.css               # Dashboard styling
│   ├── login.html             # Enhanced login page
│   ├── login.css              # Login/signup styling
│   ├── Signup.html            # Enhanced signup page
│   ├── signup.css             # Signup styling (imports login.css)
│   ├── settings.html          # Comprehensive settings page
│   ├── settings.css           # Settings page styling
│   ├── Default.html           # Original default page
│   └── Default.css            # Enhanced base styling
├── authCheck.js               # Client-side authentication helper
└── README.md                  # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Supabase account

### 1. Database Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL commands from `Backend/database_schema.sql` in your Supabase SQL Editor
3. Update your Supabase URL and keys in the configuration files

### 2. Backend Setup

```bash
cd Backend
npm install
npm start
```

The server will run on `http://localhost:3000`

### 3. Configuration

Update the Supabase credentials in these files:
- `Backend/supabaseClient.js`
- `frontend/login.html`
- `frontend/Signup.html`
- `frontend/home.html`
- `frontend/settings.html`
- `authCheck.js`

### 4. Access the Application

Open `http://localhost:3000` in your browser to access the application.

## 📊 Database Schema

### Tables Created:
- **lists**: Store user lists with colors, categories, and due dates
- **items**: Store tasks/items within lists
- **categories**: Predefined category options
- **User authentication**: Handled by Supabase Auth

### Key Features:
- Row Level Security (RLS) enabled
- User-specific data access
- Foreign key relationships
- Indexed for performance

## 🎯 API Endpoints

### Authentication
- `POST /auth/signup` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout

### Lists Management
- `GET /lists` - Get all user lists
- `GET /lists/:id` - Get specific list
- `POST /lists` - Create new list
- `PUT /lists/:id` - Update list
- `DELETE /lists/:id` - Delete list
- `POST /lists/reorder` - Reorder lists

### Tasks Management
- `GET /lists/:listId/items` - Get tasks for a list
- `POST /lists/:listId/items` - Create new task
- `DELETE /items/:id` - Delete task

## 🎨 Design System

### Color Palette
- **Primary Gradient**: Orange to Pink (`#ff6a00` to `#ee0979`)
- **Header**: Light Blue (`#5bc0de`)
- **Accent**: Red (`#ff3c3c`)
- **Success**: Green gradients
- **Warning**: Yellow/Orange
- **Danger**: Red gradients

### Typography
- **Font Family**: Arial, sans-serif
- **Headings**: Bold, with text shadows on colored backgrounds
- **Body**: Clean, readable sizes with proper line heights

### Components
- **Cards**: Rounded corners, hover effects, shadows
- **Buttons**: Gradient backgrounds, hover animations
- **Forms**: Consistent styling, focus states, validation
- **Navigation**: Bootstrap navbar with custom styling

## 📱 Mobile Responsiveness

The application is fully responsive with:
- **Tablet (768px and down)**: Adjusted layouts, stacked elements
- **Mobile (480px and down)**: Single-column layouts, touch-friendly buttons
- **Flexible grids**: Bootstrap responsive grid system
- **Scalable typography**: Relative font sizes
- **Touch interactions**: Appropriate button sizes and spacing

## 🔧 Features Implemented

### ✅ Completed Enhancements:
1. **Fixed Backend Bugs**: Removed duplicate routes, added error handling
2. **Complete Authentication**: Functional login/signup with consistent styling
3. **Enhanced Database Schema**: Added colors, due dates, categories, user associations
4. **Mobile Responsiveness**: All pages work perfectly on mobile devices
5. **Modern UI**: Consistent styling across all pages with improved aesthetics
6. **Advanced Features**: Color coding, categories, due dates, drag & drop
7. **Settings Page**: Comprehensive user management and preferences
8. **Data Export**: Download user data functionality
9. **Improved Navigation**: Consistent header across all pages
10. **Error Handling**: Proper validation and user feedback

### 🎉 Key Improvements:
- **Professional Grade**: Production-ready code quality
- **Security**: Proper authentication and data protection
- **Performance**: Optimized queries and efficient rendering
- **User Experience**: Intuitive interface with helpful feedback
- **Maintainable Code**: Well-organized, documented codebase

## 🔒 Security Features

- **Supabase Auth**: Industry-standard authentication
- **Row Level Security**: Database-level access control
- **HTTPS Ready**: Secure communication protocols
- **Input Validation**: Server and client-side validation
- **SQL Injection Protection**: Parameterized queries
- **XSS Protection**: Proper data sanitization

## 🚀 Deployment

The application is ready for deployment to:
- **Vercel/Netlify**: Frontend hosting
- **Heroku/Railway**: Backend hosting  
- **Supabase**: Database and authentication
- **Custom VPS**: Full-stack deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please create an issue in the repository or contact the development team.

---

**ColoredLists** - Making task management beautiful and efficient! 🎨✅