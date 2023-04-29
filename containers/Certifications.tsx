import React from 'react';
import CertificationsCard from '../components/CertificationsCard';
import { certifications } from '../portfolio';
import { Container, Row, Col } from 'reactstrap';

const Certifications = () => {
  return (
    certifications && (
      <section className="section pb-0 bg-gradient-info my-5">
        <Container>
          <div className="d-flex px-3">
            <div>
              <div className="icon icon-lg icon-shape bg-gradient-white shadow rounded-circle text-info">
                <i className="ni ni-books text-info" />
              </div>
            </div>
            <div className="pl-4">
              <h4 className="display-3 text-white">Certifications</h4>
            </div>
          </div>
          <Row className="row-grid align-items-center">
            {certifications.map((info) => {
              return (
                <Col className="order-lg-1" lg="6" key={info.certificate}>
                  <CertificationsCard {...info} />
                </Col>
              );
            })}
          </Row>
        </Container>
        <div className="separator separator-bottom separator-skew zindex-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            version="1.1"
            viewBox="0 0 2560 100"
            x="0"
            y="0"
          >
            <polygon className="fill-white" points="2560 0 2560 100 0 200" />
          </svg>
        </div>
      </section>
    )
  );
};

export default Certifications;
