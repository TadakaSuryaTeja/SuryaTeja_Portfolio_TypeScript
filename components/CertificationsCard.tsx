import React from 'react';
import { Card, CardBody, Button } from 'reactstrap';
import { CertificationsType } from '../types/sections';
import Fade from 'react-reveal/Fade';

const CertificationsCard = ({
  certificate,
  issuedby,
  github,
}: CertificationsType) => {
  return (
    <Fade left duration={2000}>
      <Card className="card-lift--hover shadow mt-4">
        <CardBody>
          <div className="d-flex px-3">
            <div className="pl-4">
              <h5 className="text-info">{certificate}</h5>
              <h6>{issuedby}</h6>
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
  );
};

export default CertificationsCard;
