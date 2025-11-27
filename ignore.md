<img width="246" height="526" alt="image" src="https://github.com/user-attachments/assets/d2a61037-93b1-4546-83e4-5eaf45c36fb3" />


<img width="963" height="734" alt="Screenshot 2025-11-27 at 3 25 41 PM" src="https://github.com/user-attachments/assets/122eef60-32b5-4eb8-9577-eef3e4a36743" />



<img width="966" height="786" alt="Screenshot 2025-11-27 at 3 26 27 PM" src="https://github.com/user-attachments/assets/5a035660-ee13-4751-b71a-d4d07567b8d8" />

Step 1 — Create React project
npx create-react-app entire-listing
Step 2 — Enter project
cd entire-listing
Step 3 — Install Bootstrap
npm install bootstrap
Step 4 — Enable Bootstrap globally
Open: src/index.js

Add:

import 'bootstrap/dist/css/bootstrap.min.css';
✅ 2. FINAL FILE STRUCTURE
entire-listing/
│
└── src/
    │ index.js
    │ App.js
    │ App.css
    │
    ├── components/
    │     ├── NavbarComponent.js
    │     ├── Footer.js
    │     ├── CardGrid.js
    │     └── ListingCard.js
    │
    └── data/
          listings.js
✅ 3. CREATE DATA FILE (dynamic card content)
📌 This allows you to reuse the grid anywhere.

src/data/listings.js
const listings = [
  {
    id: 1,
    title: "Toyota Wish 2013 – Gray",
    location: "California, Albany",
    sqm: "Used",
    price: "$12,48,7000",
    img: "https://via.placeholder.com/300x200"
  },
  {
    id: 2,
    title: "5bdrm Duplex In Albany For Sale",
    location: "California, Albany",
    sqm: "678 sqm",
    price: "$12,48,7000",
    img: "https://via.placeholder.com/300x200"
  },
  {
    id: 3,
    title: "Lexus GX 460 Base 2016 Black",
    location: "California, Albany",
    sqm: "New",
    price: "$12,48,7000",
    img: "https://via.placeholder.com/300x200"
  },
  {
    id: 4,
    title: "2bdrm Townhouse in Albany For Sale",
    location: "California, Albany",
    sqm: "512 sqm",
    price: "$12,48,7000",
    img: "https://via.placeholder.com/300x200"
  }
];

export default listings;
✅ 4. NAVBAR COMPONENT
src/components/NavbarComponent.js
import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";

const NavbarComponent = () => {
  return (
    <Navbar bg="light" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand href="#">Entire-Listing</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link href="#">Shop by Category</Nav.Link>
            <Nav.Link href="#">USA</Nav.Link>
            <Nav.Link href="#">Login</Nav.Link>
            <Nav.Link href="#">
              <button className="btn btn-primary">Sell</button>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
✅ 5. FOOTER COMPONENT
src/components/Footer.js
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-primary text-white py-4 mt-5">
      <div className="text-center">
        <h5>Entire-Listing</h5>
        <p className="mb-1">
          © All rights reserved {new Date().getFullYear()} Entire-Listing
        </p>

        <div>
          <a href="#" className="text-white mx-2">About us</a>
          <a href="#" className="text-white mx-2">Privacy Policy</a>
          <a href="#" className="text-white mx-2">Terms & Conditions</a>
          <a href="#" className="text-white mx-2">Contact us</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
✅ 6. SINGLE CARD COMPONENT (reusable)
src/components/ListingCard.js
import React from "react";
import { Card } from "react-bootstrap";

const ListingCard = ({ item }) => {
  return (
    <Card className="shadow-sm rounded-3">
      <Card.Img variant="top" src={item.img} style={{ height: "200px", objectFit: "cover" }} />

      <Card.Body>
        <Card.Title>{item.title}</Card.Title>

        <Card.Text className="text-muted">
          📍 {item.location}
        </Card.Text>

        <Card.Text>
          <strong>{item.sqm}</strong>
        </Card.Text>

        <h5 className="text-primary">{item.price}</h5>
      </Card.Body>
    </Card>
  );
};

export default ListingCard;
✅ 7. GRID COMPONENT (Dynamic + Reusable Anywhere)
src/components/CardGrid.js
import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import ListingCard from "./ListingCard";

const CardGrid = ({ title, items }) => {
  return (
    <Container className="my-5">
      {title && <h3 className="mb-4">{title}</h3>}

      <Row className="g-4">
        {items.map((item) => (
          <Col key={item.id} md={3} sm={6} xs={12}>
            <ListingCard item={item} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default CardGrid;
✅ 8. APP.JS (Full Page Structure)
src/App.js
import React from "react";
import NavbarComponent from "./components/NavbarComponent";
import Footer from "./components/Footer";
import CardGrid from "./components/CardGrid";

import listings from "./data/listings";

function App() {
  return (
    <>
      <NavbarComponent />

      <div className="container my-4">
        <div className="p-5 bg-light rounded shadow-sm">
          <h2>Sell Your Property</h2>
          <p>Post ad, find, sold quickly</p>
        </div>
      </div>

      <CardGrid 
        title="Trending in USA"
        items={listings}
      />

      <Footer />
    </>
  );
}

export default App;
✅ 9. HOW TO REUSE THE GRID ANYWHERE
To use the grid again:

<CardGrid title="Featured Cars" items={listings} />
Or supply a different list:

<CardGrid title="Properties For Sale" items={propertyList} />
🎉 DONE!
You now have:

✔ Fully reusable components
✔ Bootstrap styling
✔ Navbar + Footer + Grid
✔ Dynamic listing cards
✔ Clean file structure
✔ Ready-to-run React project

If you want, I can also provide:

🔹 Dark mode version
🔹 API integration (backend)
🔹 Search + filters
🔹 Pagination
🔹 Admin dashboard

Just tell me!
