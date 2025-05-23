import React from 'react';
import PropTypes from 'prop-types';
import './TechIcon.css';

const techToClassName = {
  REACT: 'devicon-react-original colored',
  VUE: 'devicon-vuejs-plain colored',
  ANGULAR: 'devicon-angularjs-plain colored',
  NEXTJS: 'devicon-nextjs-original colored',
  TYPESCRIPT: 'devicon-typescript-plain colored',
  JAVASCRIPT: 'devicon-javascript-plain colored',
  NODEJS: 'devicon-nodejs-plain colored',
  EXPRESS: 'devicon-express-original colored',
  SPRING: 'devicon-spring-plain colored',
  SPRING_BOOT: 'devicon-spring-plain colored', // 같은 아이콘 재사용
  DJANGO: 'devicon-django-plain colored',
  FLASK: 'devicon-flask-original colored',
  MYSQL: 'devicon-mysql-plain colored',
  POSTGRESQL: 'devicon-postgresql-plain colored',
  MONGODB: 'devicon-mongodb-plain colored',
  AWS: 'devicon-amazonwebservices-original colored',
  KUBERNETES: 'devicon-kubernetes-plain colored',
  DOCKER: 'devicon-docker-plain colored',
  GIT: 'devicon-git-plain colored',
  FIGMA: 'devicon-figma-plain colored',
  JAVA: 'devicon-java-plain colored',
  PYTHON: 'devicon-python-plain colored',
  CSS: 'devicon-css3-plain colored',
  HTML: 'devicon-html5-plain colored',
};

const TechIcon = ({ tech, size = 24 }) => {
  const className = techToClassName[tech.toUpperCase()];
  return className ? (
    <div className="tech-icon-wrapper" title={tech}>
      <i className={className} style={{ fontSize: size }}></i>
    </div>
  ) : (
    <span className="tech-icon-fallback">{tech}</span>
  );
};

TechIcon.propTypes = {
  tech: PropTypes.string.isRequired,
  size: PropTypes.number,
};

export default TechIcon;