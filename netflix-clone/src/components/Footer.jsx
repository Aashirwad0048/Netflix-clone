import React from 'react';
import styled from 'styled-components';
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';

export default function Footer() {
  return (
    <FooterContainer>
      <div className="footer-content">
        {/* Social Media Links */}
        <div className="social-media">
          <a href="https://facebook.com/netflix" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <FaFacebookF />
          </a>
          <a href="https://instagram.com/netflix" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <FaInstagram />
          </a>
          <a href="https://twitter.com/netflix" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            <FaTwitter />
          </a>
          <a href="https://youtube.com/netflix" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
            <FaYoutube />
          </a>
        </div>

        {/* Footer Links */}
        <div className="footer-links">
          <div className="link-column">
            <a href="/audio-description">Audio Description</a>
            <a href="/help-center">Help Center</a>
            <a href="/gift-cards">Gift Cards</a>
            <a href="/media-center">Media Center</a>
          </div>
          <div className="link-column">
            <a href="/investor-relations">Investor Relations</a>
            <a href="/jobs">Jobs</a>
            <a href="/terms-of-use">Terms of Use</a>
            <a href="/privacy">Privacy</a>
          </div>
          <div className="link-column">
            <a href="/cookie-preferences">Cookie Preferences</a>
            <a href="/corporate-info">Corporate Information</a>
            <a href="/contact-us">Contact Us</a>
            <a href="/speed-test">Speed Test</a>
          </div>
          <div className="link-column">
            <a href="/legal-notices">Legal Notices</a>
            <a href="/only-on-netflix">Only on Netflix</a>
            <a href="/ad-choices">Ad Choices</a>
            <a href="/account">Account</a>
          </div>
        </div>

        {/* Service Code */}
        <div className="service-code">
          <button>Service Code</button>
        </div>

        {/* Copyright */}
        <div className="copyright">
          <p>&copy; 1997-2025 Netflix, Inc.</p>
        </div>

        {/* Additional Netflix Info */}
        <div className="netflix-info">
          <p>Questions? Contact us.</p>
          <div className="country-selector">
            <select>
              <option value="en">🌐 English</option>
              <option value="es">🌐 Español</option>
              <option value="fr">🌐 Français</option>
              <option value="de">🌐 Deutsch</option>
              <option value="pt">🌐 Português</option>
            </select>
          </div>
        </div>
      </div>
    </FooterContainer>
  );
}

const FooterContainer = styled.footer`
  background-color: #141414;
  color: #999;
  padding: 3rem 0 2rem;
  margin-top: 2rem;

  .footer-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 3rem;

    .social-media {
      display: flex;
      gap: 1.5rem;
      margin-bottom: 2rem;

      a {
        color: #999;
        font-size: 1.5rem;
        transition: color 0.3s ease;

        &:hover {
          color: white;
        }

        svg {
          display: block;
        }
      }
    }

    .footer-links {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 2rem;
      margin-bottom: 2rem;

      .link-column {
        display: flex;
        flex-direction: column;
        gap: 0.8rem;

        a {
          color: #999;
          text-decoration: none;
          font-size: 0.9rem;
          transition: color 0.3s ease;

          &:hover {
            color: white;
          }
        }
      }
    }

    .service-code {
      margin-bottom: 1.5rem;

      button {
        background: transparent;
        border: 1px solid #333;
        color: #999;
        padding: 0.5rem 1rem;
        font-size: 0.9rem;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
          border-color: #666;
          color: white;
        }
      }
    }

    .copyright {
      margin-bottom: 1rem;

      p {
        font-size: 0.8rem;
        color: #666;
      }
    }

    .netflix-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;

      p {
        font-size: 0.9rem;
        color: #999;
      }

      .country-selector {
        select {
          background: #141414;
          border: 1px solid #333;
          color: #999;
          padding: 0.5rem;
          font-size: 0.9rem;
          cursor: pointer;

          &:hover {
            border-color: #666;
          }

          option {
            background: #141414;
            color: #999;
          }
        }
      }
    }
  }

  /* Tablet Responsiveness */
  @media (max-width: 768px) {
    padding: 2rem 0 1.5rem;

    .footer-content {
      padding: 0 2rem;

      .social-media {
        justify-content: center;
        margin-bottom: 1.5rem;

        a {
          font-size: 1.3rem;
        }
      }

      .footer-links {
        grid-template-columns: repeat(2, 1fr);
        gap: 1.5rem;
        margin-bottom: 1.5rem;

        .link-column {
          gap: 0.6rem;

          a {
            font-size: 0.85rem;
          }
        }
      }

      .netflix-info {
        flex-direction: column;
        text-align: center;
        gap: 0.8rem;

        p {
          font-size: 0.85rem;
        }

        .country-selector select {
          font-size: 0.85rem;
          padding: 0.4rem;
        }
      }
    }
  }

  /* Mobile Responsiveness */
  @media (max-width: 480px) {
    padding: 1.5rem 0 1rem;

    .footer-content {
      padding: 0 1rem;

      .social-media {
        gap: 1rem;
        margin-bottom: 1rem;

        a {
          font-size: 1.2rem;
        }
      }

      .footer-links {
        grid-template-columns: 1fr;
        gap: 1rem;
        margin-bottom: 1rem;

        .link-column {
          gap: 0.5rem;

          a {
            font-size: 0.8rem;
          }
        }
      }

      .service-code {
        text-align: center;
        margin-bottom: 1rem;

        button {
          font-size: 0.8rem;
          padding: 0.4rem 0.8rem;
        }
      }

      .copyright {
        text-align: center;

        p {
          font-size: 0.75rem;
        }
      }

      .netflix-info {
        text-align: center;

        p {
          font-size: 0.8rem;
        }

        .country-selector select {
          font-size: 0.8rem;
          padding: 0.3rem;
          width: 100%;
          max-width: 200px;
        }
      }
    }
  }

  /* iPhone SE and smaller screens */
  @media (max-width: 375px) {
    padding: 1rem 0 0.8rem;

    .footer-content {
      padding: 0 0.8rem;

      .social-media {
        gap: 0.8rem;

        a {
          font-size: 1.1rem;
        }
      }

      .footer-links {
        gap: 0.8rem;

        .link-column {
          gap: 0.4rem;

          a {
            font-size: 0.75rem;
          }
        }
      }

      .service-code button {
        font-size: 0.75rem;
        padding: 0.35rem 0.7rem;
      }

      .copyright p {
        font-size: 0.7rem;
      }

      .netflix-info {
        p {
          font-size: 0.75rem;
        }

        .country-selector select {
          font-size: 0.75rem;
          padding: 0.25rem;
        }
      }
    }
  }
`;
