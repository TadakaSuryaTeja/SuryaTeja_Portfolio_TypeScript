import React from 'react';
import { Card, CardBody, Col, Button } from 'reactstrap';
import Fade from 'react-reveal/Fade';
import { CertificationsType } from '../types/sections';

const CertificationsCard = ({ certificate, issuedby, github }: CertificationsType) => {
  return (
    <Col lg="6">
      <Fade bottom duration={2000}>
        <Card className="shadow-lg--hover shadow mt-4">
          <CardBody>
            <div className="d-flex px-3">
              <div className="pl-4">
                <h3>{certificate}</h3>
                <p className="description mt-3">{issuedby}</p>
                {github ? (
                  <Button
                    className="btn-icon"
                    color="github"
                    href={github}
                    target="_blank"
                    rel="noopener"
                    aria-label="Github"
                  >
                    <span className="btn-inner--icon">
                      <i className="fa fa-github" />
                    </span>
                  </Button>
                ) : null}
              </div>
            </div>
          </CardBody>
        </Card>
      </Fade>
    </Col>
  );
};

export default CertificationsCard;
