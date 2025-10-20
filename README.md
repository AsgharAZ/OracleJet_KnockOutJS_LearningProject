# Banking Password Reset System

A full-stack banking application built with Oracle JET and Spring Boot that provides a secure password reset/change functionality for banking customers. The system implements a multi-step wizard that allows users to verify their identity through CNIC and account details before updating their login credentials.

## 🚀 Features

### Core Functionality
- **Multi-step Password Reset Wizard** - Guided 4-step process for secure password changes
- **Real-time Validation** - Instant feedback on CNIC, account numbers, and IBAN validation
- **Account Type Support** - Individual, Sole Proprietor, and Foreign National account types
- **Dual Verification Methods** - Support for both Account Number and IBAN verification
- **Password Strength Evaluation** - Real-time password strength assessment and feedback
- **Secure Password Hashing** - SHA-256 hashing using Web Crypto API

### Security Features
- Input validation and sanitization
- Database constraints and unique validations
- Secure API endpoints with proper error handling
- Password strength requirements and validation

## 🏗️ Architecture

### Frontend (Oracle JET + KnockoutJS)
- **Framework**: Oracle JavaScript Extension Toolkit (JET) v19.0.0
- **MVVM Pattern**: Knockout.js for data binding and reactive UI
- **Module Loading**: Require.js for dependency management
- **Responsive Design**: Mobile-first approach with Oracle JET components

### Backend (Spring Boot)
- **Framework**: Spring Boot 3.5.6 with Java 17
- **Data Access**: Spring Data JPA with Hibernate
- **Database**: PostgreSQL with proper indexing and constraints
- **API Design**: RESTful APIs with comprehensive validation

### Database Design
- **Customer Entity**: CNIC as primary key with validation constraints
- **Account Entity**: Composite unique constraints (customer + account_type)
- **Relationships**: Proper JPA relationships with foreign key mappings
- **Stored Procedures**: Complex operations handled by PostgreSQL procedures

## 📁 Project Structure

```
OracleJet_KnockOutJS_LearningProject/
├── mvvmJS/                          # Frontend Application
│   ├── src/
│   │   ├── js/
│   │   │   ├── viewModels/          # Knockout ViewModels
│   │   │   │   ├── Account_Type.js      # Account type selection
│   │   │   │   ├── Account_Details.js   # Account verification
│   │   │   │   ├── login_details_2.js   # Password reset
│   │   │   │   └── successful_registration.js # Success page
│   │   │   ├── views/               # HTML Templates
│   │   │   │   ├── Account_Type.html
│   │   │   │   ├── Account_Details.html
│   │   │   │   └── successful_registration.html
│   │   │   ├── appController.js     # Main application controller
│   │   │   ├── main.js             # Application bootstrap
│   │   │   └── root.js             # Router configuration
│   │   ├── css/                    # Stylesheets and images
│   │   └── index.html              # Main HTML file
│   ├── package.json                # Frontend dependencies
│   └── oraclejetconfig.json       # Oracle JET configuration
│
├── springOne/                      # Backend Application
│   ├── src/main/java/com/example/springOne/
│   │   ├── controller/             # REST Controllers
│   │   │   ├── AccountController.java    # Account management
│   │   │   └── CustomerController.java   # Customer management
│   │   ├── entity/                 # JPA Entities
│   │   │   ├── Account.java             # Account entity
│   │   │   └── Customer.java            # Customer entity
│   │   ├── repository/             # Data repositories
│   │   │   ├── AccountRepository.java
│   │   │   └── CustomerRepository.java
│   │   ├── service/                # Business logic services
│   │   ├── dto/                    # Data Transfer Objects
│   │   └── config/                 # Configuration classes
│   ├── src/main/resources/
│   │   ├── application.properties  # Application configuration
│   │   └── sp_create_account.sql   # Database procedures
│   └── pom.xml                     # Maven dependencies
│
└── notes/                         # Documentation and notes
    └── SpringBoot/                # Spring Boot reference materials
```

## 🛠️ Technology Stack

### Frontend Technologies
- **Oracle JET 19.0.0** - Enterprise JavaScript framework
- **Knockout.js** - MVVM data binding library
- **Require.js** - JavaScript module loader
- **HTML5/CSS3** - Modern web standards
- **Responsive Design** - Mobile-first approach

### Backend Technologies
- **Spring Boot 3.5.6** - Java web framework
- **Spring Data JPA** - Data access abstraction
- **Hibernate** - ORM framework
- **Jakarta Validation** - Bean validation
- **Maven** - Dependency management

### Database & Tools
- **PostgreSQL** - Relational database
- **Git** - Version control
- **Node.js** - JavaScript runtime

## 🚀 Getting Started

### Prerequisites
- **Java 17** or higher
- **Node.js 16** or higher
- **PostgreSQL** database
- **Maven** for backend build
- **Git** for version control

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd OracleJet_KnockOutJS_LearningProject
   ```

2. **Configure Database**
   - Create a PostgreSQL database
   - Update `springOne/src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:3306/your_database
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   spring.jpa.hibernate.ddl-auto=update
   ```

3. **Build and Run Backend**
   ```bash
   cd springOne
   ./mvnw spring-boot:run
   ```
   - Backend will be available at `http://localhost:8080`

### Frontend Setup

1. **Install Dependencies**
   ```bash
   cd mvvmJS
   npm install
   ```

2. **Build and Serve**
   ```bash
   ojet build
   ojet serve
   ```
   - Frontend will be available at `http://localhost:8000`

## 📖 API Documentation

### Customer Endpoints (`/api/v1/customers/`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get all customers |
| POST | `/` | Create new customer |
| DELETE | `/{customerId}` | Delete customer |
| PUT | `/{customerId}/password` | Update customer password |
| GET | `/validate/{cnic}` | Validate CNIC number |

### Account Endpoints (`/api/v1/accounts/`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get all accounts |
| GET | `/customer/{customerId}` | Get accounts by customer |
| POST | `/` | Create new account |
| DELETE | `/{accountNumber}` | Delete account |
| PUT | `/` | Update account |
| GET | `/validate/{accountNumber}/{cnic}` | Validate account with CNIC |
| GET | `/validate/iban/{iban}/{cnic}` | Validate IBAN with CNIC |
| GET | `/summary/{cnic}` | Get account summary |

### Request/Response Examples

#### Validate CNIC
```bash
GET /api/v1/customers/validate/1234567890123
```
Response:
```json
{
  "statusCode": "SUCCESS",
  "message": "CNIC verified successfully",
  "isValid": true
}
```

#### Update Password
```bash
PUT /api/v1/customers/1234567890123/password
Content-Type: application/json

{
  "password": "hashed_password_here"
}
```

## 💡 Usage Guide

### Password Reset Flow

1. **Account Type Selection**
   - Choose from Individual, Sole Proprietor, or Foreign National
   - Enter CNIC number (for Individual accounts)
   - Real-time validation with database verification

2. **Account Details Verification**
   - Enter Account Number (14 digits) or IBAN
   - Tab-based interface for easy switching
   - Real-time validation against database

3. **Verification Step**
   - CNIC and account linking validation
   - Cross-verification of provided details

4. **Password Update**
   - Password strength evaluation
   - Real-time matching validation
   - Secure hashing before database storage

5. **Success Confirmation**
   - Display updated account information
   - Confirmation of successful password change

### Password Requirements
- Minimum 8 characters
- At least "Fair" strength rating
- Combination of uppercase, lowercase, numbers, and special characters recommended

## 🔧 Development

### Code Organization

**Frontend Structure:**
- `viewModels/` - Business logic and data management
- `views/` - HTML templates and UI components
- `appController.js` - Main application coordination
- Modular design for easy maintenance

**Backend Structure:**
- `controller/` - REST API endpoints
- `entity/` - JPA entities and database models
- `repository/` - Data access layer
- `service/` - Business logic layer
- `dto/` - Data transfer objects

### Key Components

#### Frontend ViewModels
- **Account_Type.js** - Account type selection and CNIC validation
- **Account_Details.js** - Account number/IBAN verification
- **login_details_2.js** - Password reset with strength validation
- **successful_registration.js** - Success page management

#### Backend Controllers
- **CustomerController** - Customer management and validation
- **AccountController** - Account operations and verification

## 🗄️ Database Schema

### Customer Table
```sql
CREATE TABLE customer (
    id BIGINT PRIMARY KEY,           -- CNIC as primary key
    name VARCHAR(255) NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone_number VARCHAR(13) NOT NULL
);
```

### Account Table
```sql
CREATE TABLE accounts (
    account_number BIGINT PRIMARY KEY,
    user_id BIGINT NOT NULL,         -- Foreign key to customer.id
    account_type INTEGER NOT NULL,
    iban VARCHAR(34) UNIQUE NOT NULL,
    digitally_active BOOLEAN NOT NULL,
    FOREIGN KEY (user_id) REFERENCES customer(id)
);
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code style and patterns
- Add proper validation for new features
- Update documentation for API changes
- Test thoroughly before submitting PR

## 📝 Notes

- This application demonstrates integration between Oracle JET frontend and Spring Boot backend
- Implements modern web development practices with reactive UI patterns
- Suitable for banking and financial services requiring secure customer verification
- Can be extended for additional account management features

## 📄 License

This project is licensed under the Oracle Universal Permissive License (UPL) - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation in the `notes/` directory

---

**Built with ❤️ using Oracle JET and Spring Boot**
