# **Parkaroo**

Parkaroo is a dynamic parking management application built with **Next.js**. It provides a seamless experience for both drivers and parking space owners. Drivers can find and book nearby parking spaces, while parking space owners can list their unused spots to generate income. The app is powered by **Firebase** for authentication and database management, ensuring a secure and scalable experience.

---

## **Features**

### **For Drivers**  
- Interactive map displaying nearby parking spots using static data.  
- View detailed information about each parking spot.  
- Intuitive interface for locating the nearest and most convenient parking options.

### **For Parking Space Owners**  
- Role-based dashboard to manage your listed parking spots.  
- Add new parking spaces with a simple, guided interface.  
- View, edit, or delete your parking space listings stored in **Firebase Firestore**.  

### **Authentication and Security**  
- Firebase Authentication for secure sign-up, log-in, and role-based access.  
- Roles:  
  - **Driver**: Access map and list of parking spots.  
  - **Owner**: Manage parking spots and add new ones.  

### **Professional UI/UX**  
- Built with **Tailwind CSS** for a clean, responsive design.  
- Role-specific interfaces ensure an intuitive user experience.

---

## **Tech Stack**

- **Framework:** [Next.js](https://nextjs.org/)  
- **Authentication:** Firebase Authentication  
- **Database:** Firebase Firestore  
- **UI Styling:** Tailwind CSS  
- **API Calls:** Axios  
- **Maps:** (Specify mapping library or custom map implementation if used)  

---

## **Installation and Setup**

### **1. Clone the Repository**
```bash
git clone https://github.com/your-username/Parkaroo.git
cd Parkaroo
```

### **2.Start the Development Server**
```bash
npm run dev
