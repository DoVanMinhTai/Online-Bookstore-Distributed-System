# Book Store Microservices

![Swagger UI Screenshot](screenshot/image1.png)

A comprehensive e-commerce bookstore built with a Microservices Architecture.

---

## Tech Stack
- **Backend:** Java 21, Spring Boot 3.4.2, Spring Cloud Gateway (BFF)
- **Frontend:** Next.js
- **Database:** PostgreSQL 16
- **Identity & Access Management:** Keycloak 26.0.2
- **Reverse Proxy:** Nginx 1.27.2
- **Infrastructure:** Docker & Docker Compose

---

## System Prerequisites

To run this project locally, ensure your machine meets the following requirements:
- **Operating System:** Windows 10/11 (with **WSL2** enabled is highly recommended) or Linux/macOS.
- **Docker:** Docker Desktop installed and running.
- **Java:** JDK 21 installed for building microservices.
- **Node.js:** v18+ for running the Next.js storefront.

---

---

## Tested Hardware Configuration

This project has been tested and runs smoothly on the following setup:
- **Model:** MSI GL73 8RC.
- **Processor:** Intel Core i7 (8th Gen).
- **RAM:** 16GB.
- **Storage:** SSD is highly recommended for faster container startup.

---

## System Prerequisites (Windows Users)
To ensure this project runs smoothly, it is highly recommended to use WSL2 (Windows Subsystem for Linux) with an Ubuntu distribution.
### 1. Enable WSL2 & Install Ubuntu
   If you haven't installed WSL yet, open PowerShell as Administrator and run:
   ```bash
   wsl --install -d Ubuntu
   ```
   After installation, restart your computer and set up your Ubuntu username and password.
### 2. Install Docker Engine inside Ubuntu
   Open your Ubuntu terminal and run these commands to install Docker:
```bash
sudo apt update
sudo apt install -y ca-certificates curl gnupg

sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

sudo usermod -aG docker $USER
```
Important: Close and reopen your Ubuntu terminal for the user group changes to take effect.

### 3.Start Docker Service
In WSL2, you need to start the Docker service manually (or enable systemd):
```bash
sudo service docker start
```

Before building the project, ensure you have JDK 21 installed in your WSL environment:

```bash
sudo apt update
sudo apt install openjdk-21-jdk -y
```
Check the version to confirm:
```bash
java -version
# Should output: openjdk version "21.x.x"
```

## Installation & Setup

### Step 1: Clone the Project
```bash
git clone https://github.com/DoVanMinhTai/Bookstore-Microservices-Project.git
cd Bookstore-Microservices-Project 
```
Important: You need to cd to Root Project
### Step 2: Configure Local Domains (Hosts File)
To route traffic properly through Nginx, you must map the local domains to your `localhost`.

**For Windows Users:**
1. Open Notepad as **Administrator**.
2. Open the file: `C:\Windows\System32\drivers\etc\hosts`
3. Add the following lines to the bottom of the file:
   ```text
   127.0.0.1   storefront.local
   127.0.0.1   api.local
   127.0.0.1   pgadmin.local
   127.0.0.1   identity.local
   127.0.0.1   backoffice.local
   ```
4. Save and close.

### Step 3: Environment Variables (Added)
### Step 4: Build Java Executables (.jar)
Before running Docker, you must compile the Spring Boot applications into .jar files so Docker can build the images. Run this command in the root directory (or inside each service folder):
   ```bash
    mvn clean install -DskipTests
   ```
### Step 5: Run Docker Compose
Once the .jar files are built, use Docker Compose (V2) to build the images and start all containers.
   ```bash
    docker compose up -d --build --force-recreate
   ```
---

### You might also want to explore:

Once all services are up and running, you can access the following dashboards:

| Service | URL | Credentials (Username / Password) |
| :--- | :--- | :--- |
| **Storefront Web** | `http://storefront.local/` | *N/A* |
| **Swagger UI (APIs)** | `http://api.local/swagger-ui/` | *N/A* |
| **Keycloak (Identity)** | `http://identity.local/` | `admin` / `admin` |
| **pgAdmin (Database)** | `http://pgadmin.local/` | `admin@adc.com` / `admin` |

#### pgAdmin Setup Instructions:
1. Login with `admin@adc.com` / `admin`.
2. Click **Add New Server**.
3. **General Tab:** Name it `PostgreSQL Server`.
4. **Connection Tab:**
    - Host name/address: `postgres` *(the docker container name)*
    - Port: `5432`
    - Username: `admin`
    - Password: `admin`
5. Save the connection.

*(Note: The PostgreSQL database is also exposed to your host machine. You can connect to it using DBeaver or DataGrip via `localhost:5432` with user/pass: `admin`/`admin`).*