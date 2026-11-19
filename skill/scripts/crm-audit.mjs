// CRM Health Check — read-only HubSpot audit.
// Built from the Jipup audit engine (https://jipup.com). Single file, no npm
// dependencies. Talks ONLY to api.hubapi.com, performs ONLY read requests.
// Requires Node.js >= 18. Run with --help for usage.

var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// ../../node_modules/.pnpm/tldts@7.4.19/node_modules/tldts/dist/cjs/index.js
var require_cjs = __commonJS({
  "../../node_modules/.pnpm/tldts@7.4.19/node_modules/tldts/dist/cjs/index.js"(exports) {
    "use strict";
    function shareSameDomainSuffix(hostname, vhost) {
      if (hostname.endsWith(vhost)) {
        return hostname.length === vhost.length || hostname[hostname.length - vhost.length - 1] === ".";
      }
      return false;
    }
    function extractDomainWithSuffix(hostname, publicSuffix) {
      const publicSuffixIndex = hostname.length - publicSuffix.length - 2;
      const lastDotBeforeSuffixIndex = hostname.lastIndexOf(".", publicSuffixIndex);
      if (lastDotBeforeSuffixIndex === -1) {
        return hostname;
      }
      return hostname.slice(lastDotBeforeSuffixIndex + 1);
    }
    function getDomain$1(suffix, hostname, options) {
      if (options.validHosts !== null) {
        const validHosts = options.validHosts;
        for (const vhost of validHosts) {
          if (
            /*@__INLINE__*/
            shareSameDomainSuffix(hostname, vhost)
          ) {
            return vhost;
          }
        }
      }
      let numberOfLeadingDots = 0;
      if (hostname.startsWith(".")) {
        while (numberOfLeadingDots < hostname.length && hostname[numberOfLeadingDots] === ".") {
          numberOfLeadingDots += 1;
        }
      }
      if (suffix.length === hostname.length - numberOfLeadingDots) {
        return null;
      }
      return (
        /*@__INLINE__*/
        extractDomainWithSuffix(hostname, suffix)
      );
    }
    function getDomainWithoutSuffix$1(domain, suffix) {
      return domain.slice(0, -suffix.length - 1);
    }
    var CONTROL_CHARS = /[\t\n\r]/g;
    var extractedHostnameValidated = false;
    function isValidHostnameChar(code) {
      return code >= 97 && code <= 122 || // a-z
      code >= 48 && code <= 57 || // 0-9
      code > 127 || // non-ASCII (accepted, not punycode-checked)
      code >= 65 && code <= 90 || // A-Z (becomes valid once lowercased)
      code === 45 || // '-'
      code === 95;
    }
    function getSpecialScheme(url, schemeStart, colonIndex) {
      const length = colonIndex - schemeStart;
      const c0 = url.charCodeAt(schemeStart) | 32;
      if (length === 2) {
        return c0 === 119 && (url.charCodeAt(schemeStart + 1) | 32) === 115 ? 1 : 0;
      } else if (length === 3) {
        const c1 = url.charCodeAt(schemeStart + 1) | 32;
        const c2 = url.charCodeAt(schemeStart + 2) | 32;
        if (c0 === 119 && c1 === 115 && c2 === 115)
          return 1;
        if (c0 === 102 && c1 === 116 && c2 === 112)
          return 1;
        return 0;
      } else if (length === 4) {
        const c1 = url.charCodeAt(schemeStart + 1) | 32;
        const c2 = url.charCodeAt(schemeStart + 2) | 32;
        const c3 = url.charCodeAt(schemeStart + 3) | 32;
        if (c0 === 104 && c1 === 116 && c2 === 116 && c3 === 112)
          return 1;
        if (c0 === 102 && c1 === 105 && c2 === 108 && c3 === 101)
          return 2;
        return 0;
      } else if (length === 5) {
        return c0 === 104 && (url.charCodeAt(schemeStart + 1) | 32) === 116 && (url.charCodeAt(schemeStart + 2) | 32) === 116 && (url.charCodeAt(schemeStart + 3) | 32) === 112 && (url.charCodeAt(schemeStart + 4) | 32) === 115 ? 1 : 0;
      }
      return 0;
    }
    function extractHostname(url, urlIsValidHostname, validate = false) {
      let start = 0;
      let end = url.length;
      let hasUpper = false;
      let isSpecial = false;
      extractedHostnameValidated = false;
      if (!urlIsValidHostname) {
        if (url.startsWith("data:")) {
          return null;
        }
        while (start < url.length && url.charCodeAt(start) <= 32) {
          start += 1;
        }
        while (end > start + 1 && url.charCodeAt(end - 1) <= 32) {
          end -= 1;
        }
        if (url.charCodeAt(start) === 47 && url.charCodeAt(start + 1) === 47) {
          start += 2;
        } else {
          const indexOfProtocol = url.indexOf(":/", start);
          if (indexOfProtocol !== -1) {
            const special = getSpecialScheme(url, start, indexOfProtocol);
            if (special === 1) {
              isSpecial = true;
              start = indexOfProtocol + 2;
              while (url.charCodeAt(start) === 47 || url.charCodeAt(start) === 92) {
                start += 1;
              }
            } else if (special === 2) {
              isSpecial = true;
              start = indexOfProtocol + 1;
              let slashes = 0;
              while ((url.charCodeAt(start) === 47 || url.charCodeAt(start) === 92) && slashes < 2) {
                start += 1;
                slashes += 1;
              }
              if (slashes < 2) {
                return null;
              }
            } else {
              for (let i = start; i < indexOfProtocol; i += 1) {
                const code = url.charCodeAt(i) | 32;
                if (!(code >= 97 && code <= 122 || // [a, z]
                code >= 48 && code <= 57 || // [0, 9]
                code === 46 || // '.'
                code === 45 || // '-'
                code === 43)) {
                  const raw = url.charCodeAt(i);
                  if (raw === 9 || raw === 10 || raw === 13) {
                    return extractHostname(url.replace(CONTROL_CHARS, ""), urlIsValidHostname, validate);
                  }
                  return null;
                }
              }
              if (url.charCodeAt(indexOfProtocol + 2) === 47) {
                start = indexOfProtocol + 3;
              } else {
                return null;
              }
            }
          } else if (url.charCodeAt(start) !== 91) {
            let indexOfColon = -1;
            for (let i = start; i < end; i += 1) {
              const code = url.charCodeAt(i);
              if (code === 9 || code === 10 || code === 13) {
                return extractHostname(url.replace(CONTROL_CHARS, ""), urlIsValidHostname, validate);
              }
              if (code === 58) {
                indexOfColon = i;
                break;
              }
              if (code === 47 || code === 92 || code === 63 || code === 35) {
                break;
              }
            }
            if (indexOfColon !== -1) {
              let hasIdentifier = false;
              for (let i = indexOfColon + 1; i < end; i += 1) {
                const code = url.charCodeAt(i);
                if (code === 47 || code === 92 || code === 63 || code === 35) {
                  break;
                }
                if (code === 64) {
                  hasIdentifier = true;
                  break;
                }
              }
              if (!hasIdentifier) {
                let allDigits = true;
                let i = indexOfColon + 1;
                for (; i < end; i += 1) {
                  const code = url.charCodeAt(i);
                  if (code === 47 || code === 92 || code === 63 || code === 35) {
                    break;
                  }
                  if (code < 48 || code > 57) {
                    allDigits = false;
                    break;
                  }
                }
                if (i === indexOfColon + 1) {
                  allDigits = false;
                }
                if (!allDigits) {
                  const special = getSpecialScheme(url, start, indexOfColon);
                  if (special === 0) {
                    let isBareIpv6 = false;
                    for (let j = indexOfColon + 1; j < end; j += 1) {
                      const code = url.charCodeAt(j);
                      if (code === 47 || code === 92 || code === 63 || code === 35) {
                        break;
                      }
                      if (code === 58) {
                        isBareIpv6 = true;
                        break;
                      }
                    }
                    if (!isBareIpv6) {
                      return null;
                    }
                  } else {
                    isSpecial = true;
                    start = indexOfColon + 1;
                    if (special === 2) {
                      let slashes = 0;
                      while ((url.charCodeAt(start) === 47 || url.charCodeAt(start) === 92) && slashes < 2) {
                        start += 1;
                        slashes += 1;
                      }
                      if (slashes < 2) {
                        return null;
                      }
                    } else {
                      while (url.charCodeAt(start) === 47 || url.charCodeAt(start) === 92) {
                        start += 1;
                      }
                    }
                  }
                }
              }
            }
          }
        }
        let indexOfIdentifier = -1;
        let indexOfClosingBracket = -1;
        let indexOfPort = -1;
        let indexOfFirstColon = -1;
        let hasControl = false;
        let vValid = validate;
        let vLastDot = start - 1;
        let vLastCode = -1;
        if (validate && start < end) {
          const c0 = url.charCodeAt(start);
          if (
            // Keep these parens: they scope /*@__INLINE__*/ for terser.
            // prettier-ignore
            !/*@__INLINE__*/
            (isValidHostnameChar(c0) || c0 === 46 || c0 === 95) || c0 === 45
          ) {
            vValid = false;
          }
        }
        for (let i = start; i < end; i += 1) {
          const code = url.charCodeAt(i);
          if (code < 64) {
            if (code === 47 || code === 35 || code === 63) {
              end = i;
              break;
            } else if (code === 58) {
              if (indexOfFirstColon === -1) {
                indexOfFirstColon = i;
              }
              indexOfPort = i;
            } else if (code === 9 || code === 10 || code === 13) {
              hasControl = true;
            } else if (validate) {
              if (code === 46) {
                if (i - vLastDot > 64 || vLastCode === 46 || vLastCode === 45) {
                  vValid = false;
                }
                vLastDot = i;
              } else if (code < 48 || code > 57) {
                if (code !== 45 || vLastCode === 46) {
                  vValid = false;
                }
              }
            }
          } else if (isSpecial && code === 92) {
            end = i;
            break;
          } else if (code === 64) {
            indexOfIdentifier = i;
            indexOfFirstColon = -1;
          } else if (code === 93) {
            indexOfClosingBracket = i;
          } else if (code >= 65 && code <= 90) {
            hasUpper = true;
          } else if (validate && !/*@__INLINE__*/
          isValidHostnameChar(code)) {
            vValid = false;
          }
          if (validate) {
            vLastCode = code;
          }
        }
        if (hasControl) {
          return extractHostname(url.replace(CONTROL_CHARS, ""), urlIsValidHostname, validate);
        }
        if (indexOfIdentifier !== -1 && indexOfIdentifier >= start && indexOfIdentifier < end) {
          start = indexOfIdentifier + 1;
        }
        if (url.charCodeAt(start) === 91) {
          if (indexOfClosingBracket !== -1) {
            return url.slice(start + 1, indexOfClosingBracket).toLowerCase();
          }
          return null;
        } else if (indexOfPort !== -1 && indexOfPort > start && indexOfPort < end && // A host:port has exactly one ':' in the host (so its first ':' is its
        // last); a bare, unbracketed IPv6 literal ("2a01:e35::1") has >= 2, so
        // its first ':' precedes the last. Only the former has a ':port' to trim.
        indexOfFirstColon === indexOfPort) {
          end = indexOfPort;
        }
        if (start >= end) {
          return null;
        }
        if (validate && vValid && indexOfIdentifier === -1 && indexOfPort === -1 && indexOfClosingBracket === -1 && url.charCodeAt(end - 1) !== 46 && end - start <= 255 && // total length
        end - vLastDot - 1 <= 63 && // last label length
        vLastCode !== 45) {
          extractedHostnameValidated = true;
        }
      }
      while (end > start + 1 && url.charCodeAt(end - 1) === 46) {
        end -= 1;
      }
      const hostname = start !== 0 || end !== url.length ? url.slice(start, end) : url;
      if (hasUpper) {
        return hostname.toLowerCase();
      }
      return hostname;
    }
    function isProbablyIpv4(hostname) {
      if (hostname.length < 7) {
        return false;
      }
      if (hostname.length > 15) {
        return false;
      }
      let numberOfDots = 0;
      for (let i = 0; i < hostname.length; i += 1) {
        const code = hostname.charCodeAt(i);
        if (code === 46) {
          numberOfDots += 1;
        } else if (code < 48 || code > 57) {
          return false;
        }
      }
      return numberOfDots === 3 && hostname.charCodeAt(0) !== 46 && hostname.charCodeAt(hostname.length - 1) !== 46;
    }
    function isProbablyIpv6(hostname) {
      if (hostname.length < 3) {
        return false;
      }
      let start = hostname.startsWith("[") ? 1 : 0;
      let end = hostname.length;
      if (hostname[end - 1] === "]") {
        end -= 1;
      }
      if (end - start > 39) {
        return false;
      }
      let hasColon = false;
      for (; start < end; start += 1) {
        const code = hostname.charCodeAt(start);
        if (code === 58) {
          hasColon = true;
        } else if (!(code >= 48 && code <= 57 || // 0-9
        code >= 97 && code <= 102 || // a-f
        code >= 65 && code <= 70)) {
          return false;
        }
      }
      return hasColon;
    }
    function isIp(hostname) {
      return isProbablyIpv6(hostname) || isProbablyIpv4(hostname);
    }
    var SPECIAL_USE_DOMAINS = [
      "test",
      // RFC 6761
      "localhost",
      // RFC 6761
      "invalid",
      // RFC 6761
      "example",
      // RFC 6761
      "example.com",
      // RFC 6761
      "example.net",
      // RFC 6761
      "example.org",
      // RFC 6761
      "local",
      // RFC 6762 (mDNS)
      "onion",
      // RFC 7686 (Tor)
      "alt",
      // RFC 9476
      "home.arpa",
      // RFC 8375
      "ipv4only.arpa",
      // RFC 8880
      "resolver.arpa",
      // RFC 9462
      "service.arpa",
      // RFC 9665
      "6tisch.arpa",
      // RFC 9031
      "eap.arpa"
      // RFC 9965
    ];
    function isSpecialUse(hostname) {
      for (const name of SPECIAL_USE_DOMAINS) {
        if (hostname.endsWith(name) && (hostname.length === name.length || hostname.charCodeAt(hostname.length - name.length - 1) === 46)) {
          return true;
        }
      }
      return false;
    }
    function isValidAscii(code) {
      return code >= 97 && code <= 122 || code >= 48 && code <= 57 || code > 127;
    }
    function isValidHostname(hostname) {
      if (hostname.length > 255) {
        return false;
      }
      if (hostname.length === 0) {
        return false;
      }
      if (
        /*@__INLINE__*/
        !isValidAscii(hostname.charCodeAt(0)) && hostname.charCodeAt(0) !== 46 && // '.' (dot)
        hostname.charCodeAt(0) !== 95
      ) {
        return false;
      }
      let lastDotIndex = -1;
      let lastCharCode = -1;
      const len = hostname.length;
      for (let i = 0; i < len; i += 1) {
        const code = hostname.charCodeAt(i);
        if (code === 46) {
          if (
            // Check that previous label is < 63 bytes long (64 = 63 + '.')
            i - lastDotIndex > 64 || // Check that previous character was not already a '.'
            lastCharCode === 46 || // Check that the previous label does not end with '-' (RFC 1035 §2.3.1 LDH).
            // '_' is intentionally NOT restricted: DNS allows any octet (RFC 2181 §11) and
            // WHATWG URL does not treat '_' as a forbidden host code point.
            lastCharCode === 45
          ) {
            return false;
          }
          lastDotIndex = i;
        } else if (
          // A forbidden character in the label...
          // Keep these parens: they scope /*@__INLINE__*/ for terser.
          // prettier-ignore
          !/*@__INLINE__*/
          (isValidAscii(code) || code === 45 || code === 95) || // ...or a '-' starting a label (the byte right after a '.'). A label must
          // not begin with a hyphen (RFC 1034 §3.5 / RFC 1035 §2.3.1 LDH, as amended
          // by RFC 1123 §2.1; cf. UTS #46 CheckHyphens). The first label is covered by
          // the leading-character guard above; mirrors the trailing-'-' rule below.
          code === 45 && lastCharCode === 46
        ) {
          return false;
        }
        lastCharCode = code;
      }
      return (
        // Check that last label is shorter than 63 chars
        len - lastDotIndex - 1 <= 63 && // Check that the last character is an allowed trailing label character.
        // Since we already checked that the char is a valid hostname character,
        // we only need to check that it's different from '-'.
        lastCharCode !== 45
      );
    }
    function setDefaultsImpl({ allowIcannDomains = true, allowPrivateDomains = false, detectIp = true, detectSpecialUse = false, extractHostname: extractHostname2 = true, mixedInputs = true, validHosts = null, validateHostname = true }) {
      return {
        allowIcannDomains,
        allowPrivateDomains,
        detectIp,
        detectSpecialUse,
        extractHostname: extractHostname2,
        mixedInputs,
        validHosts,
        validateHostname
      };
    }
    var DEFAULT_OPTIONS = (
      /*@__INLINE__*/
      setDefaultsImpl({})
    );
    function setDefaults(options) {
      if (options === void 0) {
        return DEFAULT_OPTIONS;
      }
      return (
        /*@__INLINE__*/
        setDefaultsImpl(options)
      );
    }
    function getSubdomain$1(hostname, domain) {
      if (domain.length === hostname.length) {
        return "";
      }
      return hostname.slice(0, -domain.length - 1);
    }
    function getEmptyResult() {
      return {
        domain: null,
        domainWithoutSuffix: null,
        hostname: null,
        isIcann: null,
        isIp: null,
        isPrivate: null,
        isSpecialUse: null,
        publicSuffix: null,
        subdomain: null
      };
    }
    function resetResult(result) {
      result.domain = null;
      result.domainWithoutSuffix = null;
      result.hostname = null;
      result.isIcann = null;
      result.isIp = null;
      result.isPrivate = null;
      result.isSpecialUse = null;
      result.publicSuffix = null;
      result.subdomain = null;
    }
    function parseImpl(url, step, suffixLookup2, partialOptions, result) {
      const options = (
        /*@__INLINE__*/
        setDefaults(partialOptions)
      );
      if (typeof url !== "string") {
        return result;
      }
      let urlIsValid = false;
      if (!options.extractHostname) {
        result.hostname = url;
      } else if (options.mixedInputs) {
        urlIsValid = isValidHostname(url);
        result.hostname = extractHostname(url, urlIsValid, options.validateHostname);
      } else {
        result.hostname = extractHostname(url, false, options.validateHostname);
      }
      if (options.detectIp && result.hostname !== null) {
        result.isIp = isIp(result.hostname);
        if (result.isIp) {
          return result;
        }
      }
      if (options.validateHostname && options.extractHostname && result.hostname !== null && // Skip the re-scan when `url` was already validated and extractHostname
      // returned it unchanged (same reference => identical string, still valid).
      !(urlIsValid && result.hostname === url) && // Skip the re-scan when extractHostname already validated the host inline
      // (a confirmed-valid simple authority — see extract-hostname.ts).
      !extractedHostnameValidated && !isValidHostname(result.hostname)) {
        result.hostname = null;
        return result;
      }
      if (step === 0 || result.hostname === null) {
        return result;
      }
      if (step === 5 && options.detectSpecialUse) {
        result.isSpecialUse = isSpecialUse(result.hostname);
      }
      suffixLookup2(result.hostname, options, result);
      if (step === 2 || result.publicSuffix === null) {
        return result;
      }
      result.domain = getDomain$1(result.publicSuffix, result.hostname, options);
      if (step === 3 || result.domain === null) {
        return result;
      }
      result.subdomain = getSubdomain$1(result.hostname, result.domain);
      if (step === 4) {
        return result;
      }
      result.domainWithoutSuffix = getDomainWithoutSuffix$1(result.domain, result.publicSuffix);
      return result;
    }
    function fastPathLookup(hostname, options, out) {
      if (!options.allowPrivateDomains && hostname.length > 3) {
        const last = hostname.length - 1;
        const c3 = hostname.charCodeAt(last);
        const c2 = hostname.charCodeAt(last - 1);
        const c1 = hostname.charCodeAt(last - 2);
        const c0 = hostname.charCodeAt(last - 3);
        if (c3 === 109 && c2 === 111 && c1 === 99 && c0 === 46) {
          out.isIcann = true;
          out.isPrivate = false;
          out.publicSuffix = "com";
          return true;
        } else if (c3 === 103 && c2 === 114 && c1 === 111 && c0 === 46) {
          out.isIcann = true;
          out.isPrivate = false;
          out.publicSuffix = "org";
          return true;
        } else if (c3 === 117 && c2 === 100 && c1 === 101 && c0 === 46) {
          out.isIcann = true;
          out.isPrivate = false;
          out.publicSuffix = "edu";
          return true;
        } else if (c3 === 118 && c2 === 111 && c1 === 103 && c0 === 46) {
          out.isIcann = true;
          out.isPrivate = false;
          out.publicSuffix = "gov";
          return true;
        } else if (c3 === 116 && c2 === 101 && c1 === 110 && c0 === 46) {
          out.isIcann = true;
          out.isPrivate = false;
          out.publicSuffix = "net";
          return true;
        } else if (c3 === 101 && c2 === 100 && c1 === 46) {
          out.isIcann = true;
          out.isPrivate = false;
          out.publicSuffix = "de";
          return true;
        }
      }
      return false;
    }
    var nodeFlags = /* @__PURE__ */ new Uint8Array([1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 2, 2, 2, 0, 2, 2, 0, 2, 0, 0, 1, 0, 0, 2, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 2, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2, 2, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 2, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 2, 2, 0, 0, 0, 2, 0, 1, 1, 0, 2, 0, 2, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 2, 2, 0, 2, 2, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 2, 2, 0, 2, 2, 2, 2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 2, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 2, 2, 0, 0, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 2, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0]);
    var edgeStart = /* @__PURE__ */ new Uint16Array([0, 0, 0, 10, 11, 18, 106, 111, 117, 124, 130, 136, 145, 146, 147, 148, 149, 150, 151, 153, 154, 155, 157, 159, 228, 241, 243, 244, 245, 260, 267, 268, 271, 272, 273, 276, 278, 297, 298, 300, 309, 314, 331, 332, 335, 336, 338, 340, 376, 377, 379, 382, 383, 387, 389, 393, 396, 428, 431, 444, 445, 453, 454, 456, 466, 480, 481, 482, 483, 492, 493, 530, 535, 551, 571, 577, 619, 620, 647, 674, 675, 823, 829, 832, 833, 834, 839, 844, 853, 875, 876, 877, 878, 879, 880, 881, 899, 901, 902, 905, 907, 908, 910, 912, 927, 942, 947, 948, 950, 951, 952, 953, 954, 956, 959, 964, 965, 966, 968, 969, 972, 975, 976, 977, 990, 992, 1004, 1015, 1023, 1025, 1065, 1068, 1072, 1073, 1075, 1078, 1089, 1091, 1101, 1103, 1109, 1111, 1112, 1114, 1117, 1118, 1119, 1172, 1174, 1176, 1196, 1197, 1198, 1199, 1201, 1212, 1243, 1254, 1255, 1268, 1278, 1287, 1295, 1296, 1301, 1315, 1326, 1338, 1350, 1364, 1365, 1376, 1410, 1411, 1412, 1428, 1444, 1456, 1529, 1530, 1532, 1533, 1569, 1588, 1589, 1590, 1591, 1592, 1595, 1599, 1602, 1604, 1638, 1639, 1647, 1648, 1649, 1650, 1651, 1652, 1654, 1656, 1658, 1659, 1663, 1664, 1665, 1667, 1669, 1670, 1672, 1673, 1674, 1685, 1687, 1688, 1692, 1693, 1696, 1703, 1704, 1709, 1713, 1714, 1716, 1717, 1718, 1719, 1720, 1721, 1722, 1723, 1724, 1725, 1726, 1727, 1728, 1729, 1731, 1732, 1733, 2193, 2196, 2197, 2199, 2206, 2213, 2223, 2227, 2238, 2239, 2240, 2252, 2253, 2255, 2257, 2258, 2265, 2266, 2268, 2269, 2271, 2272, 2273, 2274, 2275, 2349, 2351, 2372, 2373, 2374, 2376, 2378, 2379, 2430, 2431, 2433, 2440, 2446, 2456, 2466, 2519, 2520, 2521, 2531, 2545, 2546, 2549, 2556, 2557, 2565, 2567, 2568, 2569, 2570, 2581, 2582, 2583, 2585, 2586, 2587, 2596, 2608, 2614, 2646, 2650, 2652, 2653, 2655, 2656, 2667, 2668, 2670, 2678, 2685, 2691, 2696, 2697, 2703, 2706, 2712, 2719, 2720, 2727, 2735, 2736, 2737, 2775, 2781, 2796, 2797, 2802, 2820, 2851, 2869, 2871, 2874, 2882, 2884, 2891, 2943, 2967, 2968, 2969, 2970, 2971, 2972, 2973, 2980, 2981, 2982, 2983, 2984, 2985, 2987, 2988, 2992, 3072, 3085, 3086, 3523, 3527, 3541, 3593, 3621, 3643, 3701, 3723, 3738, 3801, 3852, 3890, 3926, 3951, 4093, 4139, 4190, 4209, 4243, 4258, 4278, 4308, 4339, 4362, 4393, 4423, 4455, 4482, 4557, 4579, 4617, 4627, 4661, 4680, 4706, 4748, 4798, 4824, 4893, 4894, 4896, 4919, 4942, 4978, 5009, 5026, 5083, 5096, 5120, 5149, 5151, 5185, 5201, 5229, 5534, 5543, 5552, 5559, 5576, 5580, 5586, 5625, 5627, 5634, 5641, 5650, 5657, 5658, 5659, 5671, 5674, 5689, 5690, 5699, 5700, 5709, 5718, 5724, 5726, 5727, 5728, 5765, 5766, 5768, 5776, 5783, 5796, 5800, 5802, 5803, 5809, 5816, 5830, 5840, 5845, 5853, 5861, 5867, 5868, 5872, 5874, 5875, 5887, 5959, 5960, 5961, 5962, 5964, 5965, 5968, 5970, 5973, 5977, 5978, 5979, 5985, 5986, 5987, 5989, 5991, 5993, 5994, 5995, 5998, 6e3, 6003, 6004, 6006, 6204, 6211, 6212, 6213, 6223, 6228, 6245, 6259, 6268, 6269, 6270, 6274, 6275, 6277, 6279, 6285, 6286, 6289, 6290, 6292, 6293, 6294, 7194, 7197, 7201, 7219, 7228, 7231, 7238, 7239, 7241, 7242, 7243, 7245, 7297, 7298, 7301, 7302, 7419, 7420, 7431, 7442, 7449, 7452, 7461, 7462, 7463, 7478, 7533, 7725, 7727, 7728, 7730, 7735, 7748, 7763, 7770, 7779, 7782, 7785, 7792, 7800, 7804, 7805, 7806, 7820, 7824, 7833, 7834, 7835, 7839, 7874, 7875, 7893, 7900, 7908, 7909, 7914, 7922, 7966, 7967, 7973, 7976, 7988, 7993, 7994, 7996, 7998, 8033, 8034, 8040, 8047, 8048, 8057, 8066, 8081, 8085, 8086, 8138, 8139, 8144, 8145, 8148, 8150, 8151, 8152, 8161, 8175, 8183, 8197, 8209, 8210, 8212, 8214, 8236, 8247, 8253, 8254, 8266, 8278, 8365, 8377, 8385, 8388, 8394, 8419, 8422, 8423, 8424, 8425, 8427, 8430, 8433, 8444, 8446, 8448, 8476, 8551, 8558, 8562, 8563, 8572, 8594, 8595, 8600, 8601, 8680, 8682, 8684, 8693, 8697, 8703, 8709, 8715, 8725, 8730, 8731, 8749, 8760, 8765, 8770, 8780, 8786, 8790, 8796, 8802, 10410, 10411, 10412, 10419, 10421]);
    var edgeLength = /* @__PURE__ */ new Uint8Array([3, 3, 3, 3, 3, 3, 3, 3, 5, 8, 8, 2, 2, 3, 3, 3, 3, 3, 8, 5, 5, 5, 5, 5, 3, 3, 5, 5, 9, 12, 19, 8, 19, 8, 11, 9, 9, 8, 7, 7, 6, 8, 9, 16, 10, 7, 7, 11, 8, 6, 6, 9, 7, 11, 7, 14, 4, 4, 4, 4, 4, 4, 10, 7, 6, 6, 6, 6, 10, 10, 6, 10, 10, 22, 11, 9, 10, 10, 10, 9, 10, 8, 7, 7, 7, 8, 21, 13, 11, 11, 9, 10, 9, 13, 10, 8, 8, 9, 12, 9, 7, 10, 7, 7, 13, 7, 3, 3, 3, 3, 3, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 8, 6, 3, 3, 3, 3, 3, 3, 2, 5, 3, 3, 3, 7, 2, 2, 2, 2, 2, 2, 3, 3, 3, 1, 1, 7, 8, 5, 2, 2, 7, 2, 2, 1, 4, 1, 11, 9, 9, 5, 5, 8, 5, 5, 5, 5, 5, 5, 5, 3, 3, 3, 3, 3, 5, 11, 9, 9, 13, 7, 14, 7, 6, 6, 6, 7, 6, 6, 6, 6, 6, 6, 10, 7, 11, 9, 4, 4, 4, 4, 4, 6, 6, 6, 6, 13, 6, 8, 7, 10, 9, 9, 7, 9, 8, 9, 8, 7, 10, 6, 9, 8, 10, 10, 7, 8, 1, 9, 10, 12, 12, 12, 10, 9, 9, 10, 10, 9, 9, 1, 1, 5, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 6, 6, 6, 4, 3, 3, 3, 7, 4, 4, 4, 3, 3, 6, 7, 3, 4, 1, 2, 2, 2, 6, 1, 2, 2, 2, 2, 2, 12, 5, 3, 8, 9, 13, 4, 4, 13, 9, 9, 11, 7, 3, 12, 9, 2, 2, 2, 3, 3, 3, 3, 3, 8, 2, 2, 3, 3, 3, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 3, 7, 10, 15, 15, 7, 15, 20, 15, 9, 10, 10, 12, 14, 14, 14, 12, 12, 12, 12, 12, 14, 14, 10, 10, 10, 10, 14, 9, 9, 9, 9, 10, 14, 14, 14, 13, 13, 14, 9, 9, 9, 9, 9, 9, 7, 8, 6, 8, 8, 6, 8, 13, 8, 8, 6, 13, 8, 11, 13, 8, 6, 13, 8, 6, 9, 10, 10, 12, 14, 14, 14, 12, 12, 12, 12, 14, 14, 10, 10, 10, 10, 9, 9, 9, 10, 14, 14, 11, 13, 13, 9, 9, 9, 9, 9, 9, 2, 6, 9, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 2, 3, 3, 3, 3, 3, 3, 7, 7, 2, 3, 2, 2, 5, 3, 3, 3, 3, 3, 3, 4, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 4, 5, 7, 4, 2, 2, 12, 8, 10, 8, 10, 7, 18, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 2, 2, 3, 3, 3, 5, 5, 3, 8, 8, 6, 8, 6, 6, 4, 6, 7, 7, 7, 10, 11, 2, 5, 5, 3, 3, 3, 3, 3, 3, 5, 5, 6, 11, 10, 7, 7, 7, 4, 4, 4, 2, 3, 3, 3, 3, 3, 2, 2, 7, 5, 5, 3, 3, 3, 3, 3, 3, 3, 3, 7, 7, 7, 11, 7, 6, 9, 6, 6, 8, 10, 8, 6, 8, 13, 4, 4, 4, 4, 4, 10, 8, 11, 8, 8, 8, 10, 10, 7, 10, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 5, 5, 5, 5, 5, 5, 5, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 7, 10, 13, 7, 8, 7, 11, 8, 8, 6, 9, 8, 8, 6, 6, 6, 8, 8, 6, 6, 6, 6, 6, 9, 7, 6, 4, 4, 4, 4, 4, 4, 4, 6, 6, 6, 9, 7, 8, 10, 8, 8, 2, 3, 3, 3, 3, 3, 2, 8, 9, 9, 2, 2, 2, 3, 3, 3, 2, 3, 3, 3, 9, 2, 2, 3, 3, 3, 3, 3, 3, 5, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 12, 5, 5, 3, 5, 4, 2, 3, 2, 4, 3, 9, 2, 2, 2, 2, 2, 5, 5, 3, 8, 8, 13, 6, 10, 9, 4, 7, 9, 11, 2, 3, 7, 3, 3, 4, 1, 3, 4, 2, 9, 3, 3, 12, 5, 3, 7, 10, 10, 7, 4, 4, 6, 14, 7, 9, 7, 13, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 8, 15, 4, 4, 2, 3, 3, 3, 7, 4, 9, 9, 2, 3, 3, 3, 5, 3, 2, 2, 7, 2, 7, 6, 6, 7, 2, 4, 2, 2, 2, 2, 2, 2, 8, 8, 8, 9, 5, 2, 3, 3, 3, 3, 3, 3, 10, 7, 4, 4, 4, 4, 3, 4, 2, 3, 3, 3, 3, 3, 10, 7, 4, 4, 4, 4, 2, 3, 3, 3, 3, 10, 7, 4, 4, 4, 4, 3, 9, 6, 6, 6, 9, 13, 9, 2, 2, 2, 8, 7, 9, 5, 3, 3, 3, 5, 5, 13, 12, 9, 10, 7, 8, 7, 6, 8, 6, 11, 12, 7, 10, 4, 4, 7, 8, 11, 6, 7, 9, 8, 7, 10, 8, 9, 15, 7, 8, 5, 4, 7, 2, 3, 3, 3, 2, 14, 10, 2, 14, 10, 2, 14, 3, 9, 13, 13, 10, 14, 16, 17, 11, 2, 14, 2, 14, 3, 9, 13, 10, 14, 16, 17, 11, 14, 10, 14, 2, 7, 3, 10, 7, 14, 10, 2, 14, 10, 9, 9, 17, 6, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 10, 10, 10, 12, 9, 4, 10, 10, 11, 8, 8, 8, 7, 9, 5, 3, 3, 3, 3, 3, 3, 3, 3, 5, 8, 4, 4, 4, 4, 4, 4, 6, 16, 3, 3, 14, 3, 14, 2, 14, 9, 13, 10, 10, 14, 16, 17, 11, 6, 9, 10, 10, 12, 14, 14, 14, 12, 12, 12, 12, 14, 14, 10, 10, 10, 10, 14, 9, 9, 9, 10, 14, 14, 14, 9, 9, 9, 9, 9, 9, 2, 14, 9, 13, 10, 10, 14, 16, 17, 11, 6, 14, 2, 14, 9, 17, 13, 10, 10, 14, 17, 16, 17, 11, 6, 2, 14, 9, 13, 10, 14, 17, 16, 17, 11, 2, 14, 9, 13, 10, 14, 16, 17, 11, 2, 14, 9, 13, 10, 17, 16, 11, 17, 2, 14, 10, 19, 7, 2, 14, 9, 13, 10, 19, 10, 7, 14, 17, 16, 17, 11, 6, 2, 14, 9, 13, 10, 19, 7, 14, 16, 17, 11, 2, 14, 9, 13, 10, 10, 14, 17, 16, 17, 11, 6, 2, 14, 9, 13, 10, 10, 14, 17, 16, 17, 11, 6, 2, 14, 9, 13, 17, 13, 10, 10, 14, 17, 16, 17, 11, 6, 3, 2, 14, 9, 13, 10, 10, 14, 16, 17, 11, 6, 9, 10, 12, 14, 14, 14, 12, 12, 12, 12, 12, 14, 14, 14, 10, 10, 10, 14, 9, 9, 9, 9, 14, 14, 14, 13, 13, 14, 9, 9, 9, 9, 9, 9, 4, 11, 2, 14, 9, 13, 17, 13, 10, 19, 10, 7, 14, 17, 16, 17, 11, 6, 2, 14, 9, 13, 17, 13, 10, 19, 10, 7, 14, 17, 16, 17, 11, 6, 2, 14, 9, 13, 10, 19, 7, 14, 17, 16, 17, 11, 2, 9, 10, 10, 7, 17, 3, 3, 12, 12, 16, 15, 15, 12, 14, 14, 14, 20, 20, 13, 12, 12, 12, 12, 12, 12, 20, 25, 14, 14, 12, 12, 10, 10, 10, 10, 14, 9, 9, 9, 25, 4, 9, 17, 10, 7, 14, 16, 21, 13, 13, 14, 20, 14, 13, 17, 24, 9, 12, 13, 25, 13, 21, 20, 17, 9, 9, 9, 9, 9, 9, 12, 17, 4, 4, 9, 9, 9, 10, 10, 12, 14, 14, 14, 12, 12, 12, 12, 12, 14, 14, 10, 10, 10, 10, 14, 9, 9, 9, 9, 10, 14, 14, 14, 13, 13, 14, 9, 9, 9, 9, 9, 9, 9, 10, 14, 12, 12, 14, 14, 10, 9, 9, 9, 10, 14, 14, 14, 9, 9, 9, 9, 2, 1, 5, 8, 7, 11, 11, 1, 3, 3, 3, 5, 3, 3, 4, 8, 9, 10, 10, 12, 14, 14, 14, 12, 12, 12, 12, 14, 14, 10, 10, 10, 10, 14, 9, 9, 9, 10, 14, 14, 14, 13, 13, 14, 9, 9, 9, 9, 9, 9, 7, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 2, 2, 6, 7, 6, 2, 3, 2, 3, 6, 2, 7, 6, 10, 7, 4, 9, 12, 6, 14, 4, 12, 7, 2, 2, 1, 2, 7, 6, 4, 4, 4, 6, 8, 8, 7, 2, 2, 13, 2, 2, 2, 2, 6, 2, 8, 12, 2, 7, 7, 6, 8, 10, 12, 2, 2, 2, 3, 3, 13, 2, 2, 3, 3, 6, 7, 6, 4, 5, 6, 3, 3, 3, 3, 4, 16, 8, 5, 4, 3, 3, 3, 5, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 11, 12, 7, 7, 13, 9, 10, 17, 12, 8, 9, 7, 17, 17, 8, 5, 12, 10, 13, 14, 5, 5, 5, 13, 5, 5, 5, 3, 3, 3, 5, 16, 5, 5, 5, 5, 7, 12, 14, 8, 12, 8, 10, 12, 9, 11, 7, 9, 7, 10, 7, 13, 9, 7, 12, 8, 17, 7, 7, 16, 10, 13, 13, 8, 10, 10, 14, 17, 7, 16, 16, 15, 8, 10, 10, 12, 17, 17, 7, 17, 14, 7, 10, 17, 8, 7, 7, 7, 8, 15, 15, 7, 14, 10, 10, 10, 11, 11, 7, 7, 13, 8, 10, 7, 16, 7, 8, 7, 14, 17, 12, 10, 11, 21, 8, 9, 7, 13, 9, 8, 6, 13, 6, 12, 7, 6, 13, 10, 10, 10, 8, 18, 9, 17, 13, 10, 12, 6, 13, 6, 11, 8, 13, 10, 13, 18, 13, 11, 13, 8, 16, 7, 10, 8, 16, 12, 10, 8, 8, 14, 11, 8, 15, 8, 8, 7, 7, 12, 7, 8, 9, 14, 15, 8, 9, 10, 9, 15, 7, 8, 8, 12, 13, 9, 10, 15, 13, 7, 10, 10, 20, 7, 6, 9, 6, 6, 14, 11, 14, 11, 12, 9, 10, 16, 16, 12, 7, 11, 28, 8, 11, 10, 7, 21, 8, 7, 9, 4, 4, 4, 17, 7, 8, 6, 9, 6, 6, 13, 6, 6, 6, 6, 18, 20, 14, 8, 11, 12, 9, 10, 13, 15, 15, 19, 8, 9, 12, 7, 10, 16, 12, 9, 9, 9, 14, 12, 11, 10, 9, 12, 11, 18, 9, 9, 9, 10, 7, 7, 16, 8, 9, 7, 13, 12, 10, 14, 18, 7, 8, 11, 7, 7, 8, 8, 13, 7, 7, 7, 11, 15, 13, 11, 7, 8, 15, 11, 7, 8, 18, 14, 13, 18, 15, 10, 12, 12, 9, 7, 11, 11, 8, 7, 10, 8, 14, 12, 10, 18, 7, 10, 9, 7, 8, 13, 10, 14, 10, 8, 8, 23, 7, 7, 11, 12, 12, 17, 7, 7, 11, 11, 17, 16, 16, 7, 8, 11, 14, 14, 8, 10, 7, 7, 16, 16, 13, 9, 11, 9, 15, 15, 11, 11, 7, 7, 14, 7, 9, 7, 7, 16, 10, 13, 10, 11, 14, 7, 11, 10, 11, 7, 11, 10, 11, 15, 11, 15, 10, 12, 10, 14, 13, 11, 11, 12, 13, 10, 7, 13, 10, 16, 12, 21, 15, 9, 10, 10, 7, 11, 14, 17, 7, 7, 8, 11, 13, 12, 8, 15, 14, 14, 8, 17, 12, 10, 10, 7, 9, 11, 7, 10, 7, 11, 18, 7, 11, 7, 12, 11, 8, 8, 14, 12, 7, 8, 15, 3, 7, 7, 5, 2, 9, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 2, 5, 3, 3, 3, 3, 3, 3, 4, 4, 3, 3, 3, 3, 3, 3, 5, 11, 6, 4, 7, 10, 7, 7, 11, 1, 10, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 5, 7, 3, 5, 6, 3, 3, 5, 2, 2, 5, 3, 4, 13, 11, 3, 3, 6, 3, 5, 14, 2, 2, 3, 8, 2, 2, 12, 5, 18, 5, 3, 3, 3, 16, 5, 5, 5, 10, 7, 13, 12, 13, 9, 12, 14, 19, 9, 9, 21, 9, 9, 10, 6, 9, 6, 15, 10, 6, 12, 8, 6, 10, 15, 4, 4, 6, 6, 9, 9, 12, 16, 14, 23, 7, 7, 7, 14, 9, 7, 7, 11, 14, 10, 7, 10, 10, 10, 12, 6, 11, 10, 13, 11, 15, 11, 7, 12, 10, 3, 7, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 4, 3, 7, 1, 5, 2, 2, 2, 5, 5, 5, 5, 3, 3, 3, 3, 3, 5, 5, 10, 9, 11, 8, 7, 12, 8, 9, 7, 6, 13, 11, 6, 13, 7, 9, 9, 4, 4, 4, 4, 4, 6, 10, 7, 8, 13, 8, 8, 9, 14, 7, 8, 10, 7, 7, 7, 9, 6, 9, 7, 2, 12, 5, 3, 3, 13, 4, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 3, 3, 3, 3, 3, 3, 3, 3, 4, 5, 5, 5, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 8, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 9, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 2, 2, 2, 5, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 1, 7, 6, 4, 12, 3, 3, 3, 3, 3, 8, 7, 3, 3, 3, 3, 3, 3, 4, 4, 11, 15, 14, 2, 8, 3, 5, 5, 8, 10, 8, 6, 4, 7, 17, 7, 4, 5, 2, 6, 3, 2, 2, 12, 5, 5, 3, 15, 13, 8, 11, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 5, 3, 3, 3, 3, 4, 18, 2, 12, 5, 3, 3, 3, 3, 3, 5, 16, 8, 8, 9, 6, 6, 4, 4, 4, 4, 31, 6, 6, 10, 11, 21, 10, 9, 7, 10, 7, 7, 2, 4, 4, 4, 4, 6, 5, 3, 3, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 6, 6, 6, 2, 2, 2, 5, 3, 3, 3, 7, 7, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 3, 3, 3, 3, 8, 2, 3, 3, 3, 3, 3, 5, 9, 11, 3, 3, 3, 3, 4, 4, 3, 3, 3, 3, 3, 5, 10, 9, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 2, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 11, 10, 10, 10, 10, 10, 11, 10, 11, 10, 11, 10, 9, 9, 11, 3, 3, 3, 3, 3, 3, 5, 3, 7, 8, 8, 7, 6, 6, 11, 4, 4, 4, 7, 8, 9, 9, 2, 3, 7, 4, 4, 2, 5, 5, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 2, 2, 5, 5, 5, 5, 5, 3, 3, 5, 5, 5, 7, 7, 6, 6, 6, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 6, 6, 8, 8, 1, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 4, 4, 6, 9, 12, 3, 7, 10, 7, 2, 2, 3, 3, 3, 3, 3, 4, 3, 3, 2, 2, 2, 2, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 5, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 5, 5, 8, 8, 6, 6, 8, 6, 7, 4, 4, 4, 4, 4, 4, 6, 7, 5, 5, 20, 19, 8, 10, 9, 7, 10, 6, 8, 11, 6, 6, 6, 6, 13, 12, 8, 6, 7, 14, 11, 9, 2, 5, 3, 6, 2, 3, 2, 2, 2, 2, 2, 2, 2, 5, 4, 3, 7, 6, 4, 7, 4, 3, 6, 4, 7, 2, 7, 7, 7, 5, 5, 5, 5, 3, 3, 3, 3, 3, 3, 3, 3, 3, 5, 9, 10, 10, 11, 7, 8, 20, 7, 8, 9, 8, 12, 6, 6, 6, 8, 9, 8, 12, 6, 6, 8, 13, 10, 12, 6, 6, 7, 7, 9, 6, 4, 4, 4, 4, 4, 4, 10, 6, 6, 6, 7, 14, 11, 10, 7, 8, 10, 8, 11, 14, 11, 11, 9, 7, 9, 8, 11, 9, 17, 10, 9, 2, 2, 2, 9, 3, 3, 3, 3, 15, 14, 9, 5, 5, 2, 8, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 15, 12, 22, 19, 17, 18, 18, 19, 21, 7, 16, 16, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 7, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 9, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 5, 7, 16, 11, 11, 7, 7, 7, 7, 17, 7, 8, 12, 15, 9, 19, 7, 19, 8, 21, 11, 12, 19, 14, 22, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 16, 16, 19, 24, 12, 7, 14, 7, 12, 7, 8, 10, 10, 13, 7, 12, 12, 7, 7, 10, 18, 15, 12, 16, 7, 14, 12, 17, 10, 16, 17, 12, 17, 25, 7, 7, 7, 13, 6, 9, 6, 9, 18, 6, 6, 11, 20, 10, 6, 6, 6, 6, 6, 6, 17, 6, 6, 6, 15, 6, 6, 6, 6, 6, 8, 14, 11, 12, 11, 15, 13, 19, 17, 21, 7, 18, 8, 13, 13, 8, 12, 8, 6, 6, 13, 6, 15, 15, 16, 6, 6, 16, 6, 6, 6, 14, 6, 18, 6, 6, 6, 17, 18, 9, 13, 15, 8, 19, 8, 15, 15, 18, 14, 16, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 6, 11, 10, 11, 6, 21, 23, 12, 17, 12, 11, 14, 13, 22, 15, 15, 11, 12, 14, 12, 7, 12, 8, 12, 14, 12, 18, 10, 8, 16, 19, 17, 12, 14, 15, 8, 19, 17, 12, 13, 13, 15, 18, 13, 23, 24, 23, 21, 17, 24, 8, 21, 8, 14, 14, 16, 20, 14, 8, 8, 15, 20, 8, 19, 21, 9, 8, 13, 12, 13, 15, 11, 8, 11, 9, 9, 8, 11, 8, 21, 14, 21, 15, 15, 13, 7, 19, 7, 7, 7, 7, 7, 7, 16, 12, 17, 18, 7, 7, 11, 11, 7, 9, 9, 2, 2, 3, 3, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 5, 5, 5, 5, 5, 5, 5, 5, 3, 3, 10, 10, 7, 9, 7, 7, 7, 6, 8, 6, 6, 6, 6, 6, 6, 6, 7, 6, 8, 6, 6, 9, 7, 7, 7, 4, 4, 4, 4, 4, 4, 4, 4, 8, 9, 8, 7, 8, 7, 8, 10, 7, 5, 5, 5, 5, 5, 5, 3, 9, 7, 7, 8, 6, 6, 6, 6, 6, 6, 6, 6, 9, 6, 6, 9, 11, 13, 7, 8, 9, 9, 5, 5, 5, 7, 8, 6, 6, 6, 6, 6, 6, 6, 7, 8, 9, 7, 10, 9, 10, 7, 8, 5, 5, 5, 5, 5, 5, 7, 7, 9, 8, 7, 7, 6, 6, 6, 6, 6, 6, 10, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 9, 10, 4, 4, 4, 4, 8, 7, 7, 10, 10, 9, 8, 8, 15, 9, 8, 8, 8, 8, 8, 9, 10, 9, 10, 7, 8, 13, 5, 5, 5, 5, 5, 3, 3, 7, 7, 8, 6, 6, 6, 4, 4, 11, 9, 7, 8, 9, 10, 7, 5, 5, 5, 5, 5, 3, 3, 7, 6, 6, 13, 7, 9, 8, 7, 5, 5, 5, 5, 5, 5, 5, 5, 3, 3, 3, 3, 7, 8, 7, 8, 13, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 8, 8, 6, 6, 6, 6, 7, 6, 7, 6, 6, 9, 7, 4, 4, 4, 4, 4, 4, 4, 7, 8, 7, 8, 9, 8, 8, 8, 7, 10, 7, 8, 5, 5, 5, 5, 5, 5, 5, 5, 3, 7, 7, 7, 7, 9, 7, 10, 9, 6, 6, 6, 6, 6, 8, 8, 6, 6, 6, 7, 6, 6, 6, 9, 9, 4, 4, 13, 7, 10, 9, 9, 12, 7, 8, 8, 10, 8, 8, 8, 8, 8, 8, 5, 5, 5, 5, 3, 7, 7, 11, 7, 9, 8, 8, 6, 6, 10, 6, 8, 8, 8, 6, 7, 6, 6, 12, 4, 4, 4, 4, 4, 4, 4, 4, 4, 9, 8, 8, 16, 8, 9, 8, 7, 5, 5, 5, 5, 5, 3, 3, 7, 7, 7, 10, 15, 8, 9, 8, 9, 9, 6, 6, 6, 6, 6, 6, 7, 4, 8, 7, 8, 8, 7, 8, 11, 8, 5, 5, 5, 5, 5, 3, 7, 7, 6, 11, 16, 7, 6, 4, 4, 4, 4, 9, 9, 8, 8, 8, 13, 12, 8, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 11, 7, 8, 8, 9, 13, 7, 7, 7, 9, 8, 8, 9, 12, 7, 12, 7, 12, 8, 7, 10, 12, 9, 9, 6, 6, 8, 8, 6, 6, 6, 6, 6, 6, 6, 9, 8, 9, 11, 8, 6, 6, 6, 6, 6, 12, 7, 6, 6, 6, 9, 7, 7, 6, 6, 6, 6, 6, 11, 9, 6, 6, 6, 6, 6, 7, 9, 4, 4, 4, 4, 4, 4, 4, 4, 9, 9, 9, 9, 7, 7, 7, 7, 7, 11, 7, 7, 8, 8, 8, 8, 8, 8, 9, 8, 9, 9, 7, 7, 11, 11, 7, 12, 8, 8, 8, 8, 8, 7, 8, 8, 8, 8, 8, 13, 12, 8, 8, 8, 8, 7, 7, 7, 9, 5, 5, 5, 5, 5, 5, 5, 3, 3, 7, 7, 11, 7, 8, 8, 8, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 10, 11, 6, 7, 9, 4, 4, 4, 4, 4, 4, 9, 9, 8, 9, 8, 8, 8, 7, 7, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 3, 3, 11, 7, 7, 7, 9, 6, 6, 11, 8, 10, 6, 6, 6, 12, 8, 8, 7, 6, 6, 8, 7, 4, 4, 4, 4, 4, 4, 4, 4, 9, 10, 9, 9, 8, 10, 9, 11, 8, 5, 5, 5, 7, 6, 6, 8, 7, 4, 4, 4, 4, 8, 7, 7, 8, 7, 8, 8, 5, 5, 5, 5, 7, 7, 8, 8, 8, 6, 6, 6, 6, 6, 10, 8, 9, 13, 6, 7, 6, 6, 8, 7, 8, 4, 4, 4, 4, 11, 8, 8, 8, 10, 5, 5, 8, 7, 8, 13, 8, 7, 6, 8, 6, 9, 7, 8, 7, 5, 5, 5, 5, 5, 5, 3, 3, 7, 8, 9, 6, 4, 8, 10, 10, 8, 12, 9, 13, 2, 7, 5, 5, 5, 5, 5, 7, 7, 10, 6, 6, 6, 6, 6, 6, 6, 8, 4, 4, 9, 8, 8, 8, 14, 8, 8, 8, 9, 8, 5, 5, 5, 5, 5, 3, 3, 9, 6, 6, 6, 6, 10, 12, 6, 6, 6, 6, 6, 6, 6, 4, 4, 4, 4, 11, 8, 7, 8, 8, 8, 5, 5, 3, 3, 3, 3, 7, 7, 6, 8, 6, 8, 11, 7, 6, 6, 6, 7, 4, 8, 11, 9, 10, 5, 5, 5, 3, 3, 3, 7, 7, 8, 9, 8, 15, 9, 6, 6, 6, 6, 6, 6, 11, 11, 4, 4, 4, 4, 4, 7, 9, 9, 10, 8, 7, 5, 5, 5, 5, 5, 5, 3, 3, 8, 6, 6, 6, 6, 6, 6, 6, 6, 6, 9, 7, 4, 4, 4, 4, 4, 9, 9, 8, 8, 10, 13, 5, 5, 5, 3, 17, 7, 7, 7, 7, 7, 8, 6, 8, 13, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 4, 9, 10, 8, 8, 8, 5, 5, 5, 5, 3, 7, 7, 7, 8, 8, 6, 6, 6, 8, 8, 8, 9, 10, 8, 4, 8, 10, 9, 8, 8, 8, 9, 13, 10, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 3, 3, 7, 8, 9, 9, 7, 7, 7, 10, 9, 9, 8, 9, 8, 8, 8, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 8, 12, 6, 6, 6, 6, 6, 6, 6, 6, 6, 12, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 11, 8, 8, 9, 9, 10, 8, 9, 7, 7, 5, 5, 5, 5, 5, 5, 3, 7, 8, 7, 6, 6, 8, 6, 6, 10, 4, 7, 8, 9, 12, 8, 7, 7, 5, 5, 5, 5, 5, 5, 3, 3, 7, 14, 7, 9, 8, 8, 6, 6, 8, 12, 12, 6, 6, 7, 7, 10, 4, 4, 4, 4, 4, 9, 9, 14, 9, 13, 8, 7, 5, 5, 5, 6, 6, 6, 7, 4, 8, 7, 5, 5, 5, 5, 5, 5, 5, 5, 3, 3, 7, 7, 7, 8, 6, 6, 6, 6, 6, 6, 12, 6, 6, 6, 6, 4, 4, 9, 9, 8, 8, 11, 7, 7, 7, 5, 5, 5, 3, 9, 8, 6, 6, 7, 4, 4, 4, 4, 4, 4, 8, 8, 11, 5, 5, 5, 7, 7, 7, 9, 6, 6, 6, 6, 6, 6, 9, 8, 4, 4, 4, 4, 7, 12, 9, 8, 8, 8, 7, 10, 10, 5, 5, 5, 5, 5, 5, 5, 3, 11, 14, 8, 7, 8, 8, 6, 6, 6, 6, 6, 8, 7, 6, 6, 6, 7, 6, 8, 9, 4, 4, 4, 7, 8, 9, 7, 9, 7, 7, 9, 8, 5, 5, 5, 5, 5, 5, 5, 5, 5, 11, 3, 9, 7, 7, 12, 14, 8, 6, 6, 12, 11, 8, 6, 6, 6, 6, 6, 6, 6, 6, 6, 15, 7, 4, 4, 4, 16, 9, 9, 9, 8, 9, 9, 9, 9, 9, 8, 8, 8, 13, 11, 8, 5, 5, 5, 5, 3, 7, 6, 6, 8, 8, 8, 6, 6, 7, 10, 7, 4, 4, 4, 4, 9, 7, 8, 7, 7, 7, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 3, 7, 7, 7, 9, 6, 6, 6, 6, 6, 8, 8, 7, 7, 9, 6, 6, 6, 7, 6, 6, 6, 6, 6, 15, 4, 4, 4, 4, 4, 8, 8, 7, 8, 12, 9, 8, 8, 8, 8, 8, 9, 8, 8, 10, 8, 8, 8, 8, 16, 9, 10, 2, 5, 5, 5, 5, 5, 5, 5, 9, 7, 6, 8, 9, 4, 4, 4, 4, 4, 7, 8, 8, 8, 9, 8, 11, 10, 5, 5, 5, 5, 3, 7, 8, 6, 6, 6, 6, 6, 8, 6, 6, 6, 6, 4, 12, 10, 12, 7, 7, 7, 7, 7, 7, 7, 5, 5, 5, 5, 3, 3, 7, 7, 10, 8, 9, 7, 6, 10, 7, 6, 6, 4, 4, 8, 9, 7, 9, 9, 9, 9, 8, 8, 8, 8, 10, 5, 5, 5, 5, 5, 5, 8, 7, 6, 6, 6, 10, 6, 7, 10, 7, 4, 4, 4, 4, 4, 4, 4, 12, 9, 10, 7, 7, 10, 8, 10, 5, 12, 9, 6, 6, 6, 6, 6, 7, 6, 4, 4, 4, 10, 9, 9, 8, 7, 7, 5, 5, 5, 5, 5, 5, 3, 3, 13, 7, 7, 9, 7, 7, 7, 8, 9, 9, 7, 8, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 7, 13, 9, 15, 15, 4, 4, 4, 4, 4, 10, 10, 9, 8, 9, 8, 8, 9, 7, 8, 7, 8, 5, 5, 7, 6, 6, 6, 4, 4, 4, 7, 8, 11, 8, 5, 5, 5, 5, 5, 5, 5, 7, 6, 6, 6, 6, 6, 6, 9, 11, 10, 7, 4, 4, 4, 9, 8, 8, 5, 5, 5, 5, 5, 9, 9, 6, 6, 6, 6, 6, 6, 6, 9, 9, 4, 4, 4, 4, 8, 8, 8, 9, 9, 8, 8, 8, 13, 2, 4, 2, 7, 5, 5, 5, 5, 5, 5, 9, 9, 6, 6, 6, 6, 10, 8, 8, 8, 6, 6, 6, 4, 4, 9, 8, 10, 8, 9, 8, 8, 8, 9, 8, 8, 5, 3, 3, 3, 11, 6, 6, 6, 7, 6, 6, 6, 4, 4, 9, 8, 5, 5, 5, 5, 5, 3, 11, 8, 6, 6, 6, 6, 6, 9, 7, 4, 4, 14, 10, 9, 8, 12, 8, 8, 8, 11, 15, 8, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 11, 11, 11, 10, 10, 7, 7, 3, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 3, 3, 3, 7, 11, 7, 7, 11, 11, 7, 8, 9, 10, 7, 7, 9, 9, 9, 9, 7, 7, 10, 8, 13, 8, 8, 8, 8, 11, 10, 6, 6, 8, 10, 11, 14, 14, 6, 6, 6, 6, 6, 6, 9, 11, 7, 7, 6, 8, 12, 11, 11, 6, 6, 10, 6, 6, 6, 6, 6, 10, 7, 7, 6, 6, 11, 6, 6, 6, 11, 8, 9, 7, 6, 10, 11, 9, 10, 11, 7, 11, 8, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 8, 6, 6, 8, 9, 10, 9, 6, 6, 6, 10, 6, 6, 6, 6, 11, 10, 11, 10, 9, 8, 7, 7, 7, 7, 11, 14, 8, 10, 9, 9, 8, 8, 7, 11, 8, 8, 8, 11, 11, 10, 10, 9, 10, 8, 11, 10, 8, 11, 9, 12, 8, 10, 8, 11, 8, 9, 9, 11, 11, 10, 11, 13, 8, 7, 8, 8, 9, 7, 8, 8, 8, 8, 7, 8, 2, 2, 2, 2, 2, 2, 2, 4, 4, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 2, 3, 3, 3, 3, 3, 3, 3, 3, 8, 6, 4, 4, 4, 11, 7, 11, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 5, 5, 5, 5, 3, 3, 3, 3, 8, 7, 7, 8, 8, 4, 8, 7, 7, 7, 9, 7, 8, 9, 8, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 6, 3, 3, 3, 3, 3, 3, 3, 3, 4, 2, 2, 3, 3, 3, 3, 3, 3, 4, 5, 5, 3, 3, 8, 8, 6, 9, 4, 4, 10, 7, 3, 3, 3, 2, 5, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 3, 2, 2, 2, 3, 3, 3, 3, 3, 4, 10, 2, 3, 3, 3, 3, 3, 3, 3, 4, 2, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 3, 3, 3, 5, 2, 4, 2, 6, 2, 2, 9, 5, 5, 3, 3, 3, 3, 3, 3, 3, 5, 5, 5, 9, 8, 7, 9, 6, 6, 11, 4, 4, 4, 4, 4, 4, 4, 4, 6, 6, 7, 7, 11, 8, 8, 6, 5, 11, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 2, 2, 3, 3, 3, 3, 3, 3, 6, 4, 4, 4, 4, 3, 3, 3, 3, 5, 7, 2, 3, 3, 3, 3, 3, 8, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 6, 4, 4, 4, 4, 2, 2, 3, 3, 3, 3, 3, 3, 3, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 2, 2, 3, 3, 3, 3, 3, 3, 2, 3, 3, 3, 3, 3, 6, 3, 3, 8, 10, 3, 4, 4, 1, 1, 1, 1, 1, 1, 1, 8, 9, 10, 7, 7, 1, 14, 18, 13, 18, 13, 10, 10, 16, 13, 18, 16, 13, 16, 18, 13, 22, 16, 16, 16, 14, 21, 16, 9, 14, 16, 9, 9, 14, 10, 10, 14, 12, 14, 19, 12, 11, 18, 13, 17, 15, 15, 15, 15, 16, 14, 13, 19, 18, 15, 19, 18, 12, 18, 12, 11, 20, 14, 15, 10, 17, 17, 16, 19, 20, 21, 15, 13, 16, 15, 15, 15, 1, 1, 3, 8, 7, 7, 8, 8, 8, 1, 6, 1, 1, 6, 3, 3, 4, 7, 3, 3, 5, 5, 4, 4, 4, 4, 4, 2, 7, 7, 8, 12, 3, 4, 5, 1, 3, 4, 4, 10, 4, 3, 3, 3, 8, 7, 7, 2, 2, 2, 2, 2, 2, 2, 2, 2, 12, 9, 20, 7, 5, 5, 5, 9, 13, 5, 5, 5, 5, 5, 3, 3, 3, 16, 5, 5, 5, 13, 7, 8, 8, 11, 8, 7, 9, 7, 11, 12, 9, 9, 8, 8, 11, 10, 14, 7, 12, 10, 11, 13, 7, 9, 11, 17, 17, 14, 13, 7, 8, 7, 10, 10, 7, 16, 13, 7, 8, 17, 12, 9, 8, 6, 7, 10, 6, 6, 12, 6, 8, 10, 8, 8, 8, 6, 8, 6, 14, 6, 6, 6, 13, 6, 10, 6, 6, 7, 14, 8, 6, 6, 10, 11, 10, 9, 9, 7, 7, 6, 6, 6, 9, 9, 7, 9, 10, 9, 13, 12, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 6, 6, 6, 8, 8, 6, 8, 9, 10, 9, 7, 10, 10, 8, 7, 8, 7, 10, 12, 9, 8, 15, 8, 7, 8, 8, 7, 7, 15, 13, 7, 10, 9, 14, 18, 16, 7, 24, 7, 8, 10, 11, 16, 8, 14, 7, 9, 9, 9, 13, 19, 14, 15, 14, 11, 7, 13, 9, 10, 7, 13, 9, 10, 11, 12, 8, 9, 2, 3, 5, 8, 7, 4, 4, 15, 10, 5, 3, 3, 3, 3, 3, 5, 4, 4, 4, 2, 2, 2, 2, 2, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 2, 12, 5, 3, 8, 10, 15, 6, 7, 2, 3, 2, 5, 5, 12, 2, 5, 5, 5, 5, 2, 2, 5, 5, 12, 9, 5, 2, 2, 9, 5, 5, 12, 12, 5, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 9, 12, 5, 8, 8, 9, 5, 5, 5, 8, 19, 7, 16, 15, 14, 9, 9, 9, 9, 7, 11, 11, 11, 7, 14, 10, 10, 5, 5, 5, 5, 5, 5, 5, 5, 5, 15, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 9, 9, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 14, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 15, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 5, 5, 5, 5, 5, 5, 5, 12, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 9, 9, 12, 9, 9, 12, 12, 12, 15, 7, 11, 7, 14, 11, 18, 13, 8, 18, 15, 18, 12, 14, 12, 8, 8, 8, 8, 9, 9, 9, 12, 7, 10, 10, 8, 8, 12, 12, 12, 7, 12, 12, 9, 7, 7, 7, 7, 7, 8, 15, 12, 9, 10, 10, 7, 10, 10, 13, 11, 10, 9, 22, 11, 9, 8, 8, 8, 8, 8, 13, 18, 13, 9, 15, 19, 9, 7, 7, 10, 7, 7, 7, 11, 8, 13, 17, 7, 7, 10, 10, 10, 7, 20, 16, 7, 7, 7, 7, 7, 7, 11, 21, 12, 12, 13, 11, 14, 16, 8, 8, 13, 11, 7, 7, 13, 7, 7, 14, 15, 15, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 13, 10, 18, 6, 6, 6, 6, 6, 6, 6, 6, 6, 11, 8, 8, 12, 12, 11, 11, 8, 12, 9, 9, 9, 13, 13, 9, 9, 9, 9, 9, 9, 6, 10, 12, 6, 6, 6, 6, 17, 11, 7, 7, 7, 7, 14, 14, 12, 6, 7, 7, 6, 6, 15, 10, 13, 10, 6, 8, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 7, 13, 9, 9, 15, 13, 6, 12, 12, 6, 19, 11, 10, 7, 7, 16, 8, 19, 17, 9, 9, 9, 9, 9, 6, 6, 6, 10, 8, 16, 8, 6, 6, 9, 6, 6, 6, 6, 6, 6, 6, 6, 8, 8, 8, 6, 7, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 14, 6, 6, 6, 6, 20, 6, 9, 6, 14, 9, 9, 9, 6, 9, 8, 8, 12, 9, 8, 8, 8, 8, 7, 8, 12, 7, 8, 8, 8, 6, 8, 6, 6, 6, 6, 6, 6, 6, 9, 8, 8, 6, 6, 13, 9, 12, 13, 12, 14, 13, 12, 11, 11, 6, 8, 8, 8, 6, 13, 12, 11, 11, 12, 6, 11, 12, 11, 13, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 15, 6, 6, 6, 6, 6, 6, 6, 13, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 8, 8, 8, 8, 6, 18, 6, 12, 13, 13, 13, 9, 10, 15, 9, 12, 6, 6, 6, 6, 6, 6, 6, 6, 9, 15, 10, 9, 10, 13, 9, 19, 8, 18, 17, 10, 10, 8, 8, 6, 6, 6, 6, 6, 6, 10, 14, 8, 16, 16, 9, 8, 15, 8, 8, 10, 12, 14, 7, 7, 8, 8, 7, 7, 7, 7, 8, 13, 13, 11, 9, 9, 9, 12, 10, 17, 8, 11, 9, 7, 7, 14, 8, 14, 14, 7, 7, 7, 7, 7, 7, 14, 7, 7, 7, 7, 7, 10, 10, 8, 14, 7, 7, 7, 7, 8, 8, 8, 8, 8, 17, 9, 7, 15, 7, 8, 12, 7, 9, 14, 7, 7, 7, 9, 13, 8, 14, 7, 16, 18, 13, 15, 14, 12, 13, 10, 15, 9, 7, 7, 7, 10, 13, 15, 15, 9, 9, 9, 9, 19, 11, 7, 11, 11, 13, 8, 8, 8, 8, 7, 12, 19, 17, 9, 9, 13, 7, 7, 7, 9, 7, 7, 7, 12, 13, 15, 10, 8, 8, 14, 15, 12, 13, 13, 8, 12, 14, 7, 11, 7, 14, 15, 13, 12, 8, 8, 8, 8, 11, 13, 15, 15, 8, 13, 12, 8, 8, 8, 13, 10, 16, 14, 11, 8, 8, 12, 12, 9, 15, 15, 12, 12, 13, 8, 8, 9, 12, 13, 9, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 11, 12, 11, 7, 14, 7, 13, 13, 13, 12, 18, 16, 7, 12, 11, 10, 10, 15, 9, 9, 9, 21, 7, 7, 7, 11, 16, 8, 8, 11, 11, 7, 7, 7, 7, 7, 19, 7, 7, 7, 7, 7, 7, 7, 7, 7, 12, 8, 9, 12, 14, 11, 9, 9, 9, 22, 12, 3, 3, 4, 8, 8, 15, 4, 2, 2, 5, 5, 3, 3, 3, 3, 3, 3, 6, 6, 4, 4, 4, 12, 7, 10, 2, 3, 3, 3, 3, 3, 3, 3, 6, 7, 3, 7, 5, 14, 4, 4, 7, 8, 10, 4, 1, 3, 3, 6, 2, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 4, 2, 2, 5, 3, 4, 2, 2, 2, 2, 2, 2, 11, 5, 5, 5, 11, 5, 5, 3, 5, 5, 5, 5, 11, 14, 13, 9, 11, 9, 12, 8, 11, 11, 8, 11, 16, 9, 9, 7, 10, 9, 12, 8, 15, 6, 7, 6, 6, 13, 10, 8, 11, 8, 6, 6, 6, 12, 16, 6, 11, 7, 8, 9, 18, 6, 6, 9, 4, 4, 6, 13, 6, 6, 6, 6, 8, 8, 9, 16, 7, 7, 14, 7, 8, 8, 8, 7, 7, 7, 7, 7, 7, 15, 13, 7, 10, 7, 7, 10, 12, 16, 15, 7, 9, 9, 14, 11, 11, 10, 9, 10, 8, 12, 7, 8, 7, 7, 10, 12, 7, 12, 8, 7, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 5, 3, 3, 5, 5, 5, 10, 4, 8, 7, 10, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 3, 3, 3, 3, 3, 3, 3, 7, 4, 5, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 5, 5, 5, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 5, 6, 6, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 9, 8, 2, 2, 2, 8, 12, 7, 7, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 8, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 5, 5, 5, 7, 11, 9, 8, 8, 8, 7, 8, 9, 7, 7, 9, 7, 7, 7, 10, 7, 7, 10, 9, 10, 6, 6, 6, 6, 6, 6, 15, 7, 8, 9, 9, 8, 6, 6, 10, 9, 6, 8, 13, 9, 7, 6, 6, 6, 6, 6, 6, 12, 6, 6, 7, 6, 7, 6, 6, 6, 10, 10, 7, 6, 6, 6, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 6, 14, 6, 6, 7, 7, 9, 6, 6, 6, 6, 9, 9, 8, 9, 10, 9, 8, 9, 12, 7, 7, 7, 8, 7, 10, 12, 11, 9, 10, 7, 7, 7, 9, 10, 10, 8, 12, 9, 7, 7, 9, 8, 8, 8, 10, 7, 7, 8, 9, 9, 7, 7, 7, 8, 2, 4, 6, 3, 4, 2, 3, 3, 3, 3, 2, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 3, 3, 3, 3, 3, 3, 3, 3, 5, 8, 6, 4, 7, 3, 3, 3, 3, 3, 3, 3, 12, 3, 3, 3, 3, 3, 3, 4, 4, 2, 3, 5, 3, 4, 7, 3, 3, 3, 3, 3, 3, 4, 3, 3, 3, 3, 3, 3, 3, 4, 3, 3, 6, 4, 3, 4, 2, 2, 2, 5, 3, 3, 3, 3, 3, 5, 4, 4, 4, 4, 7, 6, 8, 9, 2, 2, 2, 2, 3, 3, 3, 5, 7, 2, 3, 3, 8, 7, 7, 2, 2, 8, 5, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 5, 5, 8, 8, 7, 7, 6, 10, 6, 9, 7, 11, 4, 6, 8, 8, 7, 8, 4, 5, 5, 5, 5, 3, 3, 11, 8, 9, 6, 6, 8, 7, 4, 4, 7, 8, 7, 2, 2, 3, 3, 3, 3, 4, 3, 3, 3, 3, 3, 3, 3, 3, 7, 2, 2, 5, 3, 3, 2, 3, 3, 3, 3, 3, 3, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 12, 5, 5, 3, 3, 3, 5, 10, 12, 6, 15, 4, 6, 6, 7, 14, 9, 3, 3, 3, 3, 3, 8, 2, 2, 3, 5, 5, 3, 3, 3, 3, 3, 3, 8, 8, 8, 7, 5, 8, 4, 6, 11, 2, 2, 7, 3, 3, 2, 9, 8, 5, 5, 3, 3, 3, 5, 5, 7, 7, 6, 6, 10, 6, 8, 6, 8, 9, 7, 4, 4, 4, 4, 7, 6, 6, 7, 7, 10, 9, 8, 11, 8, 3, 3, 3, 3, 3, 4, 4, 2, 3, 3, 3, 3, 3, 7, 6, 2, 5, 6, 7, 6, 4, 8, 9, 11, 2, 2, 3, 3, 3, 3, 3, 3, 3, 2, 2, 5, 3, 3, 3, 3, 3, 9, 9, 6, 4, 8, 7, 7, 5, 9, 8, 6, 2, 8, 7, 8, 5, 5, 5, 5, 5, 3, 3, 3, 16, 8, 7, 7, 7, 8, 7, 7, 7, 7, 9, 6, 9, 6, 10, 7, 7, 7, 6, 10, 8, 9, 11, 11, 8, 4, 4, 10, 8, 8, 6, 9, 6, 11, 8, 8, 8, 15, 7, 8, 9, 5, 3, 3, 3, 3, 3, 5, 2, 2, 3, 8, 9, 10, 3, 2, 2, 2, 2, 2, 2, 3, 6, 4, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 2, 3, 3, 3, 3, 3, 3, 3, 11, 5, 3, 3, 3, 3, 3, 3, 3, 3, 6, 7, 4, 4, 2, 3, 3, 3, 3, 3, 3, 3, 3, 12, 7, 4, 12, 4, 6, 5, 4, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 2, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 11, 10, 6, 4, 6, 10, 8, 3, 3, 3, 3, 3, 3, 3, 3, 5, 4, 4, 4, 2, 2, 2, 2, 2, 2, 2, 2, 5, 3, 4, 4, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 10, 5, 5, 5, 5, 5, 5, 3, 3, 3, 3, 3, 3, 3, 3, 7, 8, 8, 7, 13, 12, 10, 10, 8, 8, 7, 7, 9, 12, 11, 6, 6, 8, 8, 9, 7, 7, 7, 10, 15, 10, 4, 4, 4, 4, 4, 11, 8, 8, 9, 7, 9, 14, 14, 12, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 12, 5, 5, 5, 11, 10, 7, 9, 3, 8, 7, 3, 15, 13, 11, 4, 4, 2, 2, 2, 19, 7, 5, 5, 3, 3, 3, 3, 3, 3, 3, 5, 22, 18, 6, 14, 17, 4, 4, 19, 16, 18, 2, 3, 3, 7, 2, 3, 2, 3, 3, 6, 4, 2, 3, 3, 2, 5, 3, 3, 3, 3, 3, 3, 3, 9, 9, 2, 3, 2, 2, 2, 3, 3, 3, 5, 7, 14, 7, 7, 12, 9, 13, 6, 11, 6, 10, 9, 7, 7, 8, 12, 12, 8, 8, 8, 10, 7, 7, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 5, 8, 10, 7, 8, 11, 8, 12, 9, 4, 14, 7, 7, 9, 13, 2, 3, 3, 3, 3, 3, 3, 2, 3, 3, 3, 1, 2, 2, 3, 3, 3, 3, 3, 3, 5, 2, 2, 5, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 8, 4, 4, 4, 3, 2, 3, 3, 3, 3, 5, 2, 2, 2, 2, 5, 5, 5, 5, 3, 3, 3, 3, 3, 3, 3, 3, 3, 7, 7, 7, 7, 7, 8, 8, 8, 8, 8, 12, 9, 8, 8, 9, 8, 6, 17, 6, 6, 6, 8, 8, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 7, 4, 4, 8, 8, 9, 9, 9, 7, 7, 7, 7, 7, 7, 7, 9, 9, 9, 7, 8, 8, 8, 10, 7, 13, 10, 8, 9, 3, 3, 5, 13, 3, 3, 3, 3, 3, 7, 7, 6, 6, 10, 13, 11, 11, 8, 8, 9, 8, 9, 9, 10, 10, 10, 11, 10, 10, 13, 13, 16, 15, 11, 12, 9, 9, 10, 9, 11, 10, 9, 9, 14, 7, 8, 3, 10, 7, 7, 3, 2, 2, 2, 5, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 6, 7, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 4, 11, 6, 7, 4, 6, 2, 2, 3, 3, 3, 1, 3, 3, 3, 3, 3, 3, 6, 4, 4, 2, 2, 2, 3, 3, 3, 3, 4, 4, 6, 6, 6, 6, 5, 4, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 9, 11, 6, 10, 9, 12, 7, 7, 11, 14, 9, 7, 12, 3, 3, 7, 12, 11, 12, 7, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 9, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 3, 3, 3, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 11, 5, 5, 5, 5, 5, 5, 5, 5, 11, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 5, 5, 5, 5, 5, 5, 5, 3, 3, 3, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 3, 3, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 6, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 3, 10, 3, 3, 3, 11, 3, 5, 9, 11, 8, 12, 14, 9, 7, 8, 7, 7, 11, 11, 7, 7, 10, 9, 8, 10, 9, 7, 7, 7, 7, 7, 7, 8, 8, 7, 11, 8, 8, 8, 7, 7, 10, 8, 7, 13, 12, 7, 17, 10, 8, 8, 11, 7, 11, 11, 14, 7, 11, 7, 8, 6, 9, 20, 8, 7, 9, 16, 7, 10, 6, 11, 10, 8, 9, 7, 16, 11, 11, 9, 8, 9, 8, 8, 8, 11, 8, 15, 8, 8, 9, 7, 8, 8, 11, 10, 7, 5, 7, 10, 10, 15, 7, 7, 7, 8, 7, 8, 8, 10, 11, 10, 10, 10, 11, 11, 7, 8, 6, 8, 8, 8, 10, 6, 8, 6, 6, 7, 8, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 16, 6, 15, 6, 7, 11, 11, 7, 9, 10, 11, 13, 10, 6, 16, 8, 10, 12, 11, 6, 6, 6, 6, 6, 6, 6, 10, 6, 10, 7, 7, 7, 11, 7, 11, 6, 6, 6, 6, 6, 6, 17, 7, 7, 6, 6, 12, 22, 6, 6, 6, 6, 6, 8, 6, 6, 6, 6, 7, 6, 6, 5, 6, 6, 8, 11, 6, 9, 14, 11, 9, 11, 7, 7, 8, 6, 6, 6, 8, 10, 9, 6, 6, 6, 6, 9, 7, 6, 6, 6, 6, 6, 15, 6, 4, 4, 4, 6, 4, 17, 8, 11, 6, 6, 9, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 7, 6, 6, 6, 6, 10, 6, 10, 6, 6, 6, 6, 12, 8, 6, 6, 6, 6, 6, 6, 6, 6, 6, 9, 6, 6, 6, 6, 18, 6, 6, 6, 8, 9, 10, 7, 8, 9, 10, 11, 7, 13, 6, 8, 8, 6, 6, 14, 7, 7, 7, 7, 10, 7, 14, 9, 6, 6, 9, 15, 9, 7, 14, 6, 11, 14, 13, 7, 12, 8, 7, 7, 7, 7, 7, 12, 7, 10, 9, 16, 6, 8, 6, 5, 17, 6, 8, 10, 4, 6, 4, 10, 15, 17, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 8, 4, 4, 11, 7, 4, 4, 7, 7, 7, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 19, 17, 6, 10, 11, 6, 6, 6, 6, 18, 6, 6, 11, 4, 4, 4, 5, 6, 6, 6, 9, 5, 6, 4, 6, 6, 4, 6, 6, 6, 6, 10, 6, 6, 4, 6, 6, 10, 6, 10, 6, 6, 6, 6, 11, 6, 6, 10, 6, 6, 8, 6, 6, 6, 8, 6, 11, 4, 11, 9, 10, 9, 11, 4, 8, 4, 11, 12, 7, 9, 8, 6, 7, 7, 8, 12, 12, 11, 13, 10, 11, 7, 7, 7, 9, 7, 11, 10, 7, 7, 7, 16, 11, 10, 11, 17, 9, 9, 8, 8, 7, 7, 7, 9, 7, 7, 7, 14, 7, 13, 9, 11, 10, 14, 10, 10, 12, 11, 10, 7, 10, 5, 14, 8, 8, 8, 9, 7, 8, 7, 7, 9, 8, 7, 8, 7, 7, 7, 7, 7, 7, 7, 11, 8, 10, 8, 7, 8, 14, 11, 8, 9, 9, 9, 8, 24, 10, 10, 12, 7, 7, 15, 11, 8, 8, 12, 11, 8, 9, 9, 7, 8, 9, 10, 11, 10, 11, 7, 12, 7, 7, 11, 9, 8, 14, 13, 12, 8, 11, 10, 8, 8, 7, 7, 14, 9, 10, 8, 9, 11, 7, 14, 8, 8, 13, 8, 8, 12, 7, 10, 14, 14, 11, 9, 10, 9, 9, 7, 7, 11, 11, 13, 9, 13, 5, 5, 5, 7, 9, 5, 11, 12, 14, 8, 7, 7, 11, 10, 9, 7, 8, 8, 7, 10, 11, 11, 5, 5, 7, 5, 5, 5, 7, 7, 15, 7, 7, 8, 7, 15, 12, 12, 10, 7, 8, 7, 11, 7, 7, 7, 23, 11, 8, 8, 11, 10, 7, 8, 11, 7, 19, 7, 7, 6, 9, 9, 9, 11, 3, 4, 7, 8, 6, 6, 4, 10, 8, 2, 2]);
    var edgeChild = /* @__PURE__ */ new Uint16Array([0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 12, 1, 1, 1, 1, 1, 17, 1, 1, 1, 12, 1, 12, 1, 12, 13, 1, 1, 1, 1, 12, 1, 12, 1, 1, 1, 1, 1, 14, 21, 1, 1, 1, 1, 1, 1, 1, 19, 12, 1, 1, 1, 1, 1, 1, 1, 1, 20, 1, 1, 1, 16, 18, 1, 1, 15, 1, 1, 1, 1, 12, 1, 1, 1, 1, 1, 1, 1, 1, 22, 1, 1, 1, 1, 12, 1, 1, 1, 1, 1, 1, 1, 1, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 1, 24, 25, 26, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 12, 12, 12, 12, 1, 32, 0, 0, 0, 1, 1, 1, 1, 35, 34, 1, 1, 1, 1, 1, 33, 1, 1, 1, 1, 37, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 38, 0, 0, 0, 0, 39, 40, 0, 0, 0, 0, 12, 1, 1, 1, 12, 1, 1, 1, 43, 45, 45, 45, 43, 45, 43, 43, 44, 45, 43, 45, 43, 43, 43, 43, 43, 43, 45, 43, 43, 44, 43, 43, 43, 43, 45, 46, 46, 44, 45, 43, 43, 43, 43, 43, 12, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 49, 51, 49, 49, 49, 51, 49, 50, 49, 52, 49, 50, 50, 49, 49, 49, 50, 52, 50, 52, 49, 50, 50, 12, 54, 54, 53, 55, 50, 52, 49, 49, 47, 48, 56, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 59, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 66, 67, 12, 1, 1, 65, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 78, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 76, 79, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 77, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 12, 1, 1, 1, 1, 89, 1, 91, 1, 1, 1, 1, 1, 1, 1, 1, 94, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 97, 97, 1, 1, 12, 1, 100, 1, 1, 1, 1, 1, 1, 1, 98, 1, 99, 1, 101, 1, 1, 1, 1, 1, 102, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 110, 111, 1, 1, 1, 1, 1, 1, 113, 113, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 121, 122, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 122, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 122, 1, 1, 1, 1, 1, 1, 1, 1, 1, 126, 123, 125, 120, 1, 124, 1, 1, 114, 1, 1, 1, 1, 117, 1, 127, 1, 1, 1, 1, 1, 1, 119, 1, 108, 1, 109, 1, 12, 128, 106, 112, 1, 1, 1, 1, 1, 107, 115, 1, 12, 12, 12, 118, 116, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 12, 12, 1, 1, 1, 1, 1, 12, 134, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 12, 136, 1, 1, 1, 1, 1, 1, 1, 1, 137, 138, 12, 12, 135, 133, 45, 45, 140, 49, 49, 139, 142, 141, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 145, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 143, 0, 0, 0, 0, 1, 0, 144, 132, 1, 0, 1, 1, 12, 12, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 148, 147, 20, 1, 1, 12, 12, 1, 20, 12, 12, 1, 1, 1, 1, 1, 134, 1, 1, 152, 1, 1, 1, 1, 153, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 1, 1, 136, 1, 1, 152, 1, 1, 1, 1, 153, 1, 1, 1, 134, 1, 1, 1, 152, 1, 157, 1, 1, 1, 153, 1, 1, 134, 1, 1, 1, 157, 1, 1, 1, 1, 1, 134, 1, 1, 1, 1, 1, 1, 1, 1, 134, 1, 1, 157, 1, 1, 157, 1, 1, 1, 1, 1, 1, 1, 163, 1, 1, 1, 152, 1, 1, 157, 1, 1, 1, 153, 1, 1, 163, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 136, 1, 1, 152, 1, 157, 1, 1, 1, 153, 1, 1, 134, 1, 1, 152, 1, 157, 1, 1, 1, 153, 1, 1, 134, 1, 1, 1, 1, 152, 1, 157, 1, 1, 1, 153, 1, 1, 1, 134, 1, 1, 152, 1, 1, 1, 1, 169, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 1, 172, 1, 1, 163, 1, 1, 1, 1, 1, 152, 1, 1, 157, 1, 1, 1, 153, 1, 1, 163, 1, 1, 1, 1, 1, 152, 1, 1, 157, 1, 1, 1, 153, 1, 1, 163, 1, 1, 1, 1, 1, 157, 1, 1, 1, 1, 167, 159, 159, 12, 1, 12, 171, 1, 1, 1, 1, 1, 160, 160, 160, 154, 1, 1, 1, 158, 160, 164, 170, 1, 1, 1, 1, 158, 158, 1, 1, 156, 154, 167, 158, 162, 175, 166, 175, 1, 1, 173, 1, 166, 155, 158, 1, 1, 1, 1, 158, 1, 161, 1, 1, 1, 12, 1, 176, 1, 165, 1, 1, 1, 165, 164, 168, 174, 156, 167, 1, 1, 1, 1, 1, 1, 178, 178, 178, 178, 178, 178, 178, 178, 178, 178, 178, 178, 178, 178, 178, 178, 178, 178, 178, 179, 178, 178, 179, 178, 178, 178, 178, 180, 180, 178, 178, 179, 178, 179, 178, 178, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 182, 12, 1, 12, 12, 12, 12, 1, 12, 12, 12, 12, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 195, 1, 197, 198, 196, 195, 195, 1, 1, 201, 1, 202, 200, 1, 12, 1, 1, 1, 1, 1, 1, 12, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 213, 195, 195, 195, 195, 213, 1, 1, 1, 1, 216, 217, 215, 1, 1, 1, 1, 1, 1, 219, 219, 1, 1, 1, 219, 219, 221, 222, 220, 1, 224, 1, 1, 1, 1, 12, 230, 231, 232, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 12, 1, 1, 1, 1, 199, 203, 1, 1, 1, 1, 151, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 227, 1, 1, 1, 194, 1, 1, 1, 1, 238, 1, 1, 235, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 12, 1, 1, 1, 1, 1, 12, 1, 1, 1, 1, 1, 1, 1, 1, 185, 210, 1, 1, 1, 206, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 192, 1, 1, 1, 1, 1, 1, 1, 211, 1, 1, 1, 1, 226, 1, 1, 1, 1, 177, 1, 214, 1, 209, 1, 1, 1, 212, 1, 1, 1, 12, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 190, 1, 12, 1, 1, 12, 1, 1, 1, 1, 193, 1, 1, 1, 208, 1, 12, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 12, 1, 1, 239, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 225, 1, 1, 1, 1, 1, 12, 1, 1, 1, 1, 1, 1, 1, 1, 184, 12, 1, 1, 1, 187, 12, 1, 1, 1, 1, 1, 1, 1, 229, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 186, 1, 1, 1, 1, 1, 1, 1, 234, 1, 1, 1, 191, 1, 1, 1, 207, 1, 12, 1, 223, 204, 12, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 211, 1, 1, 1, 1, 189, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 181, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 205, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 236, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 12, 1, 237, 1, 1, 12, 1, 1, 1, 1, 188, 1, 1, 1, 205, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 12, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 12, 1, 1, 1, 228, 1, 1, 1, 1, 183, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 218, 1, 1, 1, 12, 12, 1, 1, 1, 1, 1, 1, 1, 1, 1, 233, 1, 1, 12, 1, 1, 1, 12, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 249, 0, 0, 0, 0, 0, 250, 0, 0, 0, 0, 0, 0, 1, 12, 1, 1, 1, 254, 1, 1, 1, 0, 255, 252, 253, 1, 1, 1, 1, 1, 1, 260, 1, 262, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 258, 1, 1, 1, 1, 1, 264, 1, 1, 12, 1, 12, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 263, 1, 1, 1, 12, 1, 1, 1, 1, 259, 1, 1, 1, 257, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 261, 1, 1, 1, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 1, 12, 1, 1, 1, 12, 1, 1, 270, 13, 1, 1, 1, 12, 12, 267, 268, 1, 1, 1, 1, 269, 1, 1, 12, 1, 1, 1, 1, 1, 1, 1, 271, 1, 1, 12, 16, 1, 1, 1, 1, 1, 1, 272, 1, 1, 1, 12, 12, 1, 1, 1, 1, 1, 1, 272, 12, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 281, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 285, 285, 1, 0, 0, 0, 0, 0, 1, 12, 0, 0, 0, 0, 0, 0, 0, 0, 178, 1, 290, 291, 1, 12, 1, 1, 1, 1, 12, 293, 1, 1, 292, 1, 1, 295, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 299, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 12, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 12, 0, 310, 0, 0, 311, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 59, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 335, 0, 0, 0, 0, 0, 0, 0, 0, 0, 337, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 12, 1, 1, 1, 1, 1, 1, 1, 1, 1, 12, 1, 1, 1, 1, 1, 353, 353, 354, 353, 0, 205, 1, 1, 13, 349, 1, 347, 0, 0, 0, 0, 0, 0, 0, 350, 1, 1, 355, 1, 235, 1, 1, 1, 1, 348, 1, 345, 1, 351, 1, 343, 1, 352, 1, 344, 1, 1, 1, 1, 1, 1, 1, 12, 1, 1, 1, 1, 12, 346, 346, 1, 1, 1, 194, 1, 1, 12, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 12, 1, 1, 1, 1, 12, 1, 1, 1, 1, 342, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 358, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 295, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 398, 398, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 390, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 0, 1, 366, 377, 1, 1, 365, 400, 1, 371, 1, 1, 363, 395, 1, 1, 381, 362, 367, 1, 1, 1, 374, 405, 383, 1, 1, 1, 1, 1, 1, 384, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 393, 397, 0, 0, 79, 1, 1, 0, 391, 368, 404, 369, 372, 379, 1, 394, 0, 1, 0, 79, 388, 386, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 407, 1, 1, 378, 1, 79, 1, 0, 1, 1, 1, 410, 1, 0, 0, 79, 385, 0, 1, 364, 1, 1, 1, 0, 1, 1, 387, 1, 0, 1, 1, 1, 0, 1, 412, 375, 1, 1, 0, 1, 0, 0, 403, 0, 1, 1, 1, 79, 396, 1, 1, 392, 389, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 370, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 402, 0, 79, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 406, 1, 1, 1, 0, 0, 409, 0, 0, 0, 1, 382, 1, 0, 79, 408, 1, 0, 0, 0, 0, 411, 1, 1, 0, 0, 1, 0, 1, 0, 380, 0, 376, 0, 1, 1, 1, 0, 1, 1, 0, 399, 373, 401, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 12, 1, 1, 1, 12, 427, 427, 1, 1, 12, 12, 1, 427, 1, 1, 12, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 439, 1, 1, 0, 1, 1, 1, 1, 235, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 457, 457, 1, 1, 0, 0, 343, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 12, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 470, 1, 469, 1, 1, 1, 1, 1, 1, 1, 1, 1, 474, 1, 12, 12, 1, 1, 1, 1, 1, 12, 1, 1, 1, 1, 482, 1, 1, 1, 484, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 481, 1, 476, 1, 1, 1, 1, 463, 1, 1, 1, 1, 1, 1, 1, 1, 477, 12, 1, 1, 1, 1, 483, 1, 1, 1, 478, 472, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 343, 1, 460, 1, 1, 12, 480, 1, 1, 343, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 465, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 483, 1, 1, 1, 1, 343, 1, 479, 1, 1, 1, 473, 467, 1, 1, 1, 1, 1, 468, 1, 485, 471, 1, 1, 1, 1, 1, 466, 1, 1, 1, 1, 1, 1, 1, 1, 1, 461, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 475, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 464, 1, 1, 1, 1, 1, 462, 1, 249, 486, 1, 1, 1, 1, 1, 12, 1, 1, 1, 1, 12, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 1, 0, 0, 0, 492, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 12, 1, 67, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 496, 0, 496, 496, 496, 496, 496, 496, 496, 0, 496, 496, 496, 496, 496, 1, 496, 496, 496, 0, 496, 496, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 501, 500, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 505, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 498, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 499, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 507, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 496, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 504, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 497, 0, 0, 508, 503, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 502, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 496, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 497, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 496, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 506, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 12, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 518, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 229, 229, 1, 522, 1, 1, 1, 521, 1, 1, 1, 1, 517, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 519, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 523, 1, 1, 520, 1, 1, 1, 1, 1, 1, 1, 1, 398, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 524, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 535, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 12, 1, 537, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 12, 12, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 59, 1, 1, 12, 12, 12, 12, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 556, 1, 1, 1, 1, 1, 1, 1, 557, 1, 1, 1, 1, 1, 1, 1, 555, 1, 1, 12, 1, 1, 559, 268, 1, 1, 12, 12, 1, 1, 12, 1, 12, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 563, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 569, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 132, 1, 12, 574, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 107, 1, 1, 12, 1, 1, 1, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 579, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 144, 1, 1, 1, 257, 1, 1, 12, 30, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 604, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 249, 1, 354, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 609, 1, 1, 1, 1, 0, 611, 0, 79, 0, 610, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 12, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 618, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 613, 613, 0, 617, 615, 613, 613, 613, 613, 613, 619, 613, 613, 623, 613, 613, 613, 613, 613, 613, 613, 613, 613, 613, 620, 617, 613, 613, 617, 613, 613, 613, 613, 613, 613, 613, 613, 613, 613, 613, 613, 613, 615, 613, 613, 613, 613, 613, 621, 613, 613, 613, 613, 613, 613, 0, 0, 0, 1, 622, 1, 1, 1, 1, 616, 1, 1, 1, 1, 1, 614, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 12, 627, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 12, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 12, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 12, 1, 1, 12, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 96, 64, 307, 333, 438, 565, 0, 4, 68, 265, 283, 309, 334, 360, 414, 440, 0, 529, 549, 566, 629, 9, 0, 60, 88, 424, 436, 456, 607, 0, 527, 548, 562, 644, 0, 30, 6, 0, 491, 530, 634, 592, 70, 0, 7, 312, 284, 415, 493, 443, 568, 79, 630, 0, 608, 336, 445, 495, 9, 105, 315, 536, 6, 30, 0, 338, 79, 417, 79, 513, 10, 6, 131, 277, 302, 0, 645, 539, 0, 595, 0, 63, 6, 6, 280, 95, 2, 459, 425, 437, 628, 0, 6, 0, 6, 313, 103, 6, 593, 531, 570, 0, 494, 416, 300, 314, 8, 71, 104, 631, 573, 418, 339, 327, 446, 146, 74, 317, 577, 540, 633, 596, 361, 356, 509, 6, 75, 149, 11, 0, 278, 552, 578, 597, 544, 582, 602, 643, 36, 6, 289, 322, 359, 331, 247, 30, 558, 585, 247, 41, 245, 294, 323, 332, 433, 450, 511, 301, 0, 73, 594, 0, 430, 444, 326, 79, 276, 79, 0, 612, 576, 534, 319, 448, 79, 419, 413, 0, 0, 0, 9, 587, 603, 246, 0, 451, 434, 561, 546, 605, 647, 85, 247, 42, 324, 422, 452, 601, 0, 541, 320, 303, 79, 244, 80, 28, 416, 30, 6, 420, 357, 330, 636, 624, 554, 581, 543, 0, 287, 81, 30, 432, 449, 0, 30, 453, 0, 248, 625, 547, 9, 435, 454, 247, 277, 86, 251, 626, 606, 589, 512, 455, 423, 279, 256, 87, 58, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 652, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 441, 0, 0, 0, 0, 0, 0, 0, 0, 82, 0, 129, 0, 0, 84, 580, 0, 0, 0, 0, 0, 0, 0, 27, 0, 583, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 441, 0, 0, 0, 0, 533, 0, 286, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 321, 0, 0, 0, 0, 0, 0, 0, 649, 0, 0, 0, 0, 0, 648, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 421, 0, 0, 0, 514, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 69, 0, 0, 0, 0, 0, 0, 525, 0, 0, 0, 0, 0, 0, 431, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 240, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 545, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 526, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 298, 308, 0, 0, 0, 0, 0, 560, 304, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 542, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 487, 0, 0, 0, 341, 0, 0, 0, 0, 0, 0, 282, 0, 0, 0, 0, 0, 0, 23, 0, 0, 0, 0, 600, 0, 0, 0, 0, 632, 551, 0, 0, 0, 0, 273, 0, 0, 0, 0, 0, 0, 489, 0, 0, 510, 0, 0, 0, 0, 0, 61, 0, 0, 0, 296, 57, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 275, 0, 0, 0, 0, 0, 306, 642, 0, 72, 0, 0, 0, 0, 0, 0, 0, 0, 0, 651, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 150, 0, 305, 0, 0, 0, 0, 0, 0, 599, 0, 0, 0, 0, 0, 0, 553, 0, 0, 0, 0, 0, 0, 0, 0, 0, 598, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 62, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 242, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 84, 0, 532, 0, 0, 0, 0, 0, 586, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 84, 83, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 516, 0, 515, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 288, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 488, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 316, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 567, 0, 0, 0, 0, 0, 0, 0, 0, 325, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 69, 266, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 84, 0, 638, 0, 0, 584, 0, 0, 0, 0, 0, 0, 0, 0, 0, 274, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 641, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 550, 0, 0, 0, 84, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 528, 0, 646, 0, 0, 458, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 429, 0, 0, 0, 575, 0, 93, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 31, 0, 0, 0, 0, 0, 0, 29, 92, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 318, 0, 0, 0, 243, 0, 0, 0, 0, 0, 0, 590, 0, 0, 0, 0, 130, 0, 0, 0, 0, 0, 591, 0, 0, 0, 0, 0, 0, 0, 441, 447, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 426, 0, 340, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 328, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 564, 0, 0, 0, 442, 0, 0, 428, 0, 0, 0, 0, 0, 0, 635, 0, 0, 0, 571, 0, 0, 90, 0, 572, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 538, 490, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 297, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 441, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 640, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 639, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 650, 0, 0, 0, 0, 0, 588, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 329, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 637, 0, 0, 241, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 655, 655, 655, 655, 655, 655, 655, 654, 656]);
    var labelText = "orgmilcomschnetedugovdrrformsfeedbackofficialaccoorgmilschnetgovmagazinemediaunioncargopilotgroupcaarespressworksaerodromeworkinggroupair-traffic-controlaircraftaccident-preventioneducatormarketplaceambulanceinsurancecateringairportrepbodyenginesoftwaremodellingair-surveillanceconsultingchartertrainermaintenanceservicesdesignflightskydivingfreightassociationstudentgroundhandlingdgcafuelclubtaxicrewshowballooningexpresstraderbrokerauthoragentsairtrafficjournalistsafetyconsultantmicrolightaccident-investigationparachutingequipmentproductionfederationrecreationscientistnavigationengineertradingglidingleasingresearchpassenger-associationentertainmentparaglidinghangglidingaerobaticrotorcraftemergencycertificationgovernmentaeroclubexchangelogisticschampionshiphomebuiltcouncilconferencecontrolairlinecivilaviationjournalorgcomnetedugovcoorgcomnomnetobjofforgcomnetuwukiloappsframerorgmilcomnetedugovcoradioorgcomnetcommuneedogpbcoitgvorgedugov*spreviewfrontendrelayononstagingupid*mtls*privatelinktypedreamdeveloperbravemochawindsurfaivenmirenupsunwnextbegetngrokclerkwale2bwebcsbrunputerflutterflowspawnbaseshiptodaymagicpatternsnetlifyondigitaloceanrailwayhostedclaudehasurabotdashretoolvercelgithubluyanigadgetreplitcloudflaretelebitedgecomputeevervaultexponyatnoopencrpplxzeaburwasmerframerzeropsrocketpreviewconvexmedusajsspritesonherculeseasypanelstreamlitglideossnowflakemesserliloginlinehackclubcodepennorthflankbase44corespeedleapcellngrok-freeclerkstagelovableon-fleek*us-west-3ap-south-2us-central-2us-central-1eu-central-1ap-south-1us-west-2us-east-2eu-north-1ap-north-1us-west-1us-east-1*rcloudintsegorgmilcomgobbetnetintedugovturmusicasenasamutualcoopip6uriurnin-addre164homeirisgovdixdaemoncloudnssthwien*inexexkunden4accogvormymyspreadshop4lima2ixortsinfofuturecmsfuturehosting12hpprivfuturemailinglima-cityfunkfeuer123webseitednshomemelmyspreadshopcloudletswasantqldvicactnswtascatholicwasaqldvictasidwasantozqldorgcomvicasnactnetedugovnswtasconfcomairflowlambda-urltransfer-webapptransfer-webappairflowtransfer-webapptransfer-webapp-fipstransfer-webappeu-west-3ap-south-2eu-south-2eu-central-2ap-southeast-3ap-southeast-4ap-northeast-3eu-central-1mx-central-1me-central-1ca-central-1il-central-1ap-northeast-1ap-southeast-1me-south-1af-south-1eu-south-1ap-south-1ap-southeast-7us-west-2eu-west-2ap-east-2us-east-2eu-north-1ap-southeast-2ap-northeast-2ap-southeast-5us-gov-west-1us-gov-east-1ap-southeast-6ca-west-1us-west-1eu-west-1us-east-1ap-east-1sa-east-1privatenotebookstudiolabelingnotebookstudionotebooknotebook-fipslabelingnotebookstudionotebook-fipsnotebookstudio-fipsnotebook-fipsnotebookstudionotebook-fipsnotebookstudioeu-west-3ap-south-2eu-south-2eu-central-2ap-southeast-3ap-southeast-4ap-northeast-3eu-central-1me-central-1ca-central-1il-central-1ap-northeast-1ap-southeast-1me-south-1af-south-1eu-south-1ap-south-1us-west-2eu-west-2us-east-2eu-north-1ap-southeast-2ap-northeast-2experimentsus-gov-west-1us-gov-east-1ca-west-1us-west-1eu-west-1us-east-1ap-east-1sa-east-1onrepostsagemakercopporgmilcompronetintedugovbiznameinfoshoprsorgmilcomnetedugovbrendlyresolvenzauscotvstoreorgcomnetedugovbizinfoidacaicoittvorgmilcomschnetedugovinfocloudezproxysiteacmymyspreadshopkuleuvenwebhostingtransurl123websitecloudnsinterhostsolutionsddns5476103298edgfacbmlonihkjutwvqpsryxzbarsycoororgcomedumyftpno-iporxcloud-ipfor-somemmafanfor-morewebhopselfipjozidyndnscloudnsdscloudfor-thefor-betteractivetrailcoeconorestooteorgcomeconeteduassurmoneyafricaarchitectesrestaurantloisirstourismavocatsinfoagrounivcoorgcomnetedugoviatvdeportesaludtksatorgmilcomwebgobnetinteducienciaboliviarevistacooperativaempresanombreindustriamusicapatriamedicinademocraciapoliticapuebloindigenaplurinacionalarteblogwikiinfoagrotransportenoticiasprofesionalacademiaeconomiaecologiamovimientotecnologianaturalsimplesitecepesebamapadfmgalampbacscpirngorotomtrjspaprrprrsesmscepesebamapadfmgalampbacscpirngorotomtrjspaprrprrsesms*biaamfmtcmptvfeirasampajampanatalbelemananiradiog12medindfndbmdtrdthepoaggfjdfdefinfenflegsegongengcngorgzlgslglogppgmillelqslcimcomnomadmjabimbbibbsbabcrectecsjcetcpscpvhudieticriapipsiecnbiorioecogeoteoodoproatoartfstmatvetdetbetnetcntnotfotgrueduajuespappreptmpemparqsrvadvdevgovntrturagrjorfarjusmusdesvixxyzcozfozslzbhzmaringasantamariacampinagrandegoianiasorocabafloripasaobernardocuritibaboavistarecifeaparecidasaogoncasalvadorcuiabamorenamacapalondrinacontagemsocialfortalmaceioleilaoosascoriobranconiteroi9guacutcheblogflogvlogwikitaxicoopmanauspalmascaxiasjoinvillebaruericampinassantoandreribeiraoriopretoweorgcomnetedugovv0windsurfshiptodaycloudsitecoaccoorgnetgovofmilcomgovmediatechzacoorgcomnetedugsjgovmydnspenfnlabnbmbgcbcqconcontnuyksknsmyspreadshopno-ipawdevboxbarsyonidatemfuinabusavinstanceseceuguukussryzespawncsxcloud-ipmyphotosfantasyleaguetwmailcleverappsscrappingccwucloudnsftpaccessgame-serverccgovobjectsrmalpgcust*svcalp1aeappenginermalpgmyspreadshop4lima2ixsquare7cloudscale123websitefirenet12hpflowgotdnslinkyard-cloudcloudnslima-citydnskingobjectstorageedaccogoorusorgcomnetintedua\xE9roportxn--aroport-byaassogouvcomilgobgovcloudnses-1eu-west-1us-east-1euvipit1eurarubait1s3lbwebsites3websiteru-spbru-mskelasticcsrunstnukukcaukusnl-ams-1fr-par-1fr-par-2functionsnodess3ddlwhmrdbfnck8sifrs3-websitecockpitscblmgdbdtwhkafkpubprivs3ddlwhmrdbk8sifrs3-websitecockpitscblmgdbdtwhkafks3ddlrdbk8sifrs3-websitecockpitscblmgdbdtwhkafkk8sscalebookpl-wawfr-parnl-amsbaremetalsmartlabelinginstancesdechk2kuleuvenlaravelvoorloperurownoxazapscwhstgrvaporonline-serverobservablehqelementorantagonistreclaimjoteluluencowaydiademjelasticmatlabmagentositetrendhostingaxarnetjenv-arubajelejoteravendbemergenttrafficplexconvexkeliwebserveboltbegetcdnstaticson-rancherprimetelonstackitunison-servicesdnshomelinkyardbarsyjelecloudnscocomnetgovmycn-northwest-1cn-north-1s3s3-accesspoints3-websites3s3-accesspointrdsdualstacks3-deprecatedemrappui-prods3-websiteemrstudio-prods3-object-lambdaemrnotebooks-prodexecute-apis3s3-accesspoints3s3-accesspointrdsdualstackemrappui-prods3-websiteemrstudio-prods3-object-lambdaemrnotebooks-prodexecute-apicn-northwest-1cn-north-1cn-northwest-1ebcomputeelbcn-north-1airflowcn-northwest-1cn-north-1oncn-northwest-1cn-north-1amazonawssagemakeramazonwebservicesdirectasgdsdhehahljlnmhbacscahqhshhihnlnynsnmofjbjzjxjtjhkcqtwgsjssxnxjxgxxzgz\u7DB2\u7D61\u7F51\u7EDC\u516C\u53F8orgmilcomnetedugovxn--55qx5dcanva-appsxn--io0a7iquickconnectcanvasitekhsjxn--od0algcanva-codemyqnapcloudsrvrlessclustersrealtimestorageleadpagescarrdcrdorgmilcomnomnetedugovhidnssupabaserdpareplmypiumsoxmitotaplpagesfirewalledreplitowodevwebview-assetsvfswebview-assetss3s3-accesspointdualstackemrappui-prods3-websiteaws-cloud9emrstudio-prods3-object-lambdaemrnotebooks-prodexecute-apicloud9eu-west-3ap-south-2eu-south-2eu-central-2ap-southeast-3ap-southeast-4ap-northeast-3eu-central-1me-central-1ca-central-1il-central-1ap-northeast-1ap-southeast-1me-south-1af-south-1eu-south-1ap-south-1ap-southeast-7us-west-2eu-west-2us-east-2eu-north-1ap-southeast-2ap-northeast-2ap-southeast-5ca-west-1us-west-1eu-west-1us-east-1ap-east-1sa-east-1s3s3-accesspointdualstackemrappui-prods3-websiteaws-cloud9emrstudio-prods3-object-lambdaemrnotebooks-prodexecute-apicloud9consent-portals3s3-accesspointdualstackanalytics-gatewayemrappui-prods3-websiteaws-cloud9emrstudio-prodbedrock-agentcores3-object-lambdaemrnotebooks-prodexecute-apicloud9s3s3-accesspointdualstackemrappui-prods3-websiteemrstudio-prodbedrock-agentcores3-object-lambdaemrnotebooks-prodexecute-apis3s3-accesspointdualstackemrappui-prods3-websiteemrstudio-prods3-object-lambdaemrnotebooks-prodexecute-apis3s3-accesspointdualstacks3-deprecateds3-websitebedrock-agentcores3-object-lambdaexecute-apibedrock-agentcores3s3-accesspoints3-websites3-accesspoint-fipss3-fipss3s3-accesspointdualstackemrappui-prods3-websites3-accesspoint-fipsaws-cloud9s3-fipsemrstudio-prodbedrock-agentcores3-object-lambdaemrnotebooks-prodexecute-apicloud9s3s3-accesspointdualstackemrappui-prods3-websites3-accesspoint-fipss3-fipsemrstudio-prods3-object-lambdaemrnotebooks-prodexecute-apis3s3-accesspointdualstackemrappui-prods3-websiteaws-cloud9emrstudio-prodbedrock-agentcores3-object-lambdaemrnotebooks-prodexecute-apicloud9s3s3-accesspointdualstackemrappui-prods3-websiteaws-cloud9emrstudio-prodbedrock-agentcores3-object-lambdaemrnotebooks-prodexecute-apicloud9s3s3-accesspointdualstacks3-deprecatedanalytics-gatewayemrappui-prods3-websiteaws-cloud9emrstudio-prodbedrock-agentcores3-object-lambdaemrnotebooks-prodexecute-apicloud9vfss3s3-accesspointdualstackemrappui-prods3-websiteaws-cloud9emrstudio-prods3-object-lambdaemrnotebooks-prodexecute-apicloud9eu-west-3ap-south-2eu-central-2ap-southeast-3ap-southeast-4ap-northeast-3eu-central-1mx-central-1me-central-1ca-central-1il-central-1ap-northeast-1us-northeast-1ap-southeast-1me-south-1af-south-1ap-south-1ap-southeast-7us-west-2eu-west-2ap-east-2us-east-2ap-southeast-2ap-northeast-2ap-southeast-5us-gov-west-1us-gov-east-1ap-southeast-6ca-west-1us-west-1eu-west-1us-east-1ap-east-1sa-east-1mrapaccesspoints3s3-accesspointdualstacks3-deprecatedanalytics-gatewayemrappui-prods3-websites3-accesspoint-fipsaws-cloud9s3-fipsemrstudio-prodbedrock-agentcores3-object-lambdaemrnotebooks-prodexecute-apicloud9s3s3-accesspointdualstacks3-deprecatedanalytics-gatewayemrappui-prods3-websites3-accesspoint-fipsaws-cloud9s3-fipsemrstudio-prodbedrock-agentcores3-object-lambdaemrnotebooks-prodexecute-apicloud9s3s3-accesspointdualstackemrappui-prods3-websites3-accesspoint-fipss3-fipsemrstudio-prodbedrock-agentcores3-object-lambdaemrnotebooks-prodexecute-apis3eu-west-3ap-south-2eu-south-2computes3-ap-northeast-2elbrdss3-ap-east-1s3-sa-east-1s3-us-gov-west-1s3-eu-central-1s3-ca-central-1eu-central-2ap-southeast-3ap-southeast-4ap-northeast-3s3-website-us-west-2s3-website-eu-west-1s3-external-1eu-central-1me-central-1ca-central-1il-central-1s3-us-west-1s3-eu-west-1s3-website-sa-east-1s3-website-ap-southeast-2ap-northeast-1ap-southeast-1s3-us-west-2s3-eu-west-2me-south-1af-south-1eu-south-1ap-south-1ap-southeast-7us-west-2eu-west-2us-east-2s3-website-ap-southeast-1s3-1s3-globals3-ap-northeast-3eu-north-1airflowap-southeast-2s3-us-gov-east-1s3-fips-us-gov-east-1s3-me-south-1s3-ap-south-1ap-northeast-2s3-website-us-west-1ap-southeast-5s3-eu-north-1s3-ap-southeast-1s3-website-us-gov-west-1compute-1s3-eu-west-3us-gov-west-1s3-website-ap-northeast-1us-gov-east-1s3-fips-us-gov-west-1s3-website-us-east-1s3-ap-southeast-2ca-west-1us-west-1eu-west-1us-east-1ap-east-1sa-east-1s3-us-east-2s3-ap-northeast-1authauthauth-fipsauth-fipseu-west-3ap-south-2eu-south-2eu-central-2ap-southeast-3ap-southeast-4ap-northeast-3eu-central-1mx-central-1me-central-1ca-central-1il-central-1ap-northeast-1ap-southeast-1me-south-1af-south-1eu-south-1ap-south-1ap-southeast-7us-west-2eu-west-2ap-east-2us-east-2eu-north-1ap-southeast-2ap-northeast-2ap-southeast-5us-gov-west-1us-gov-east-1ap-southeast-6ca-west-1us-west-1eu-west-1us-east-1ap-east-1sa-east-1eu-west-3eu-south-2ap-southeast-3eu-central-1ca-central-1ap-northeast-1ap-southeast-1ap-south-1us-west-2eu-west-2us-east-2eu-north-1ap-southeast-2ap-northeast-2ap-southeast-5eu-west-1us-east-1ap-east-1sa-east-1csrframeservicesbuilderstg-builderdev-builder*ociocpocsazuregcpawsdemoinstanceeu-west-3ap-south-2eu-south-2eu-central-2ap-southeast-3ap-southeast-4ap-northeast-3eu-central-1me-central-1ca-central-1il-central-1ap-northeast-1ap-southeast-1me-south-1af-south-1eu-south-1ap-south-1ap-southeast-7us-west-2eu-west-2us-east-2eu-north-1ap-southeast-2ap-northeast-2ap-southeast-5us-gov-west-1us-gov-east-1ap-southeast-6ca-west-1us-west-1eu-west-1us-east-1ap-east-1sa-east-1previeweu-4us-4us-1eu-1us-2eu-2us-3eu-3appss3-websitekrkrobjectprivateobjectkrkrskrkrsobjectkrprivateobjectkr-privatecomputepaasrag-cloudrag-cloud-chjcloudjcloud-ver-jpcdemonodebalancermembersipeuxvsoncillaocelotonzayalilynxsphinxfentigercustomercaracalsgkrobjectstoragedesgkrusobjectkrkr-naverkr-naver-devkrprivatewebsiteobjectkr-naverkr-privatekr-naver-devjpjpkrjp4jp5s3-website-jpjpkrjp4jp5objectprivateobjecto365cloudstaticxendevapp001testcode-builder-stgplatformmediasiteprojedrydpagesjsx0desazacncoitrueu4uhkukgrbrushatenadiarymyspreadshopfrom-flfrom-wvwebspace-hosttheworkpchatenablogcursorusercontentservesarcasmapplinzisakuratanwixsitefin-ncloudstoragegov-ncloudstorageappchizigiizeis-into-carsdnsiskinkyadobeaemcloudis-a-therapistpgfogmyvncdojinis-an-actress1kappfldrvkozowqa2jpnmexprgmrfirewall-gatewaydynnscafjsfbsbxooguyfrom-gawoltlab-demois-a-anarchistwiardwebteaches-yogadattowebtb-hostinglive-websiteservegamegotpantheonfrom-nhsubsc-payfrom-ohvipsinaappfrom-cadyndns-officehomelinuxfrom-mahercules-appservebbsstreakusercontentfrom-okfrom-wyfastly-terrariumis-a-llamaqualyhqportalserveexchangeon-vaporvivenushopciscofreakgrayjayleaguesmetaaiusercontentfrom-iais-a-libertariansaves-the-whalestaveusercontentyolasiteoperaunitepoint2thisis-a-catererclaudeusercontentlinodeusercontentfrom-vagithubusercontentsells-for-lesshosteurcanva-appsplaystation-cloudddnsfreefrom-pafrom-prfrom-waddnskingoutsystemscloudhotelwithflightmydattois-a-nascarfanmydbserverminiserverdamnserverservehumouris-a-playerfrom-nvfrom-nmemergentagentgentappsamplifyappfrom-kyis-an-accountantnfshostserveircfrom-akpythonanywherestackhero-networkpostman-echolikescandydyndns-mailobservableusercontentserveftpfreeboxosfrom-utcdn77-storageamazonawsneat-urlnclouddyndns-serverlinodeis-a-teacherfrom-vtgleezemythic-beastsus1-pleniteu1-plenitla1-plenitpaywhirlservecounterstrikejdevcloudhealth-carereformis-into-animegoogleapisis-a-painterafricaisa-hockeynutatmetais-an-actora2hostedis-a-democratdatadetectest-le-patrondigitaloceanspacesis-a-designeris-a-hunterlinodeobjectstemp-dnsissmarterthanyoufrom-arsimplesiteevennodetownnews-stagingis-a-liberalgooglecodejelasticservemp3qualyhqpartnerdyndns-free1cooldnsest-a-la-masiondrayddnsdynuddnsfrom-orfrom-miis-a-bloggerfrom-himydobisscanvacodeis-an-engineerest-a-la-maisonupsunappdevinappswafflecellmyasustorwpenginepoweredfrom-ctservep2psame-appmyshopblocksthingdustdatalikes-piediscordsezis-with-thebandlpusercontentis-leetshopitsite3utilitiesis-a-personaltrainersinaappladeskis-a-cheflogoipselfipbase44-sandboxnospamproxyalibabacloudcsmesswithdnsauthgearappsiamallamawithgooglelutrausercontentmochausercontentframercanvasmytabitdyndns-homew-credentialless-staticblitzcpserverdiscordsaysis-a-nurseappspotatlassian-isolated-3premotewdfrom-mtwixstudiocode0emm180rmyactivedirectoryawsappsmytuleapdnsabrpolyspaceqbuserrenderbuiltwithdarkboutirgotdnsabrdnsdopaascanva-hosted-embedawsglobalacceleratorhomesecuritypcmyiphostditchyouripclever-clouddyndns-ipon-aptibleis-a-musicianhosted-by-filessecuritytacticsappspaceusercontenthomeunixstrapiappsame-previewcf-ipfsmycloudnaselasticbeanstalkis-certifieddontexistkasserverik-serverdrive-platformatlassian-3pfirebaseappncpstorageherokuappawsapprunnerbarsycenteris-a-cubicle-slaveservehttpmyshopifyis-a-guruquicksytessiiitesorsitesmagicpatternsappis-a-cpameteorappfrom-wiis-a-rockstarbumbleshrimpdattolocaldatabricksappsreadthedocs-hostedfrom-rifamilydsdyndns-picsplesknsbplaceddnsaliasdynaliasdyndns-remotedoomdnsip-ddnsblogdnsis-a-doctorroutingthecloudamazoncognitobarsyonlinedsmynasddnsgurucloudflare-ipfsdeus-canvasfrom-idsmushcdnpagespeedmobilizerdyndns-at-homeunusualpersonhosted-by-previderis-a-republicandyn-o-saurstreamlitappworkisboringonthewificprapidqualifioappis-uberleetis-slickgetmyipwpdevcloudtypeformdyndns-at-workgentlentapismynascloudw-corp-staticblitzfrom-ingeekgalaxyservebeerfrom-mdonrenderspace-to-rentaivencloudappspacehostedwafaicloudcodespotblogspotatlassian-3p-us-gov-modfrom-ndfrom-msis-a-techieis-a-studentcustomer-ociis-a-photographerdurumisfrom-ksmassivegriddyndns-wikiis-an-entertaineris-a-hard-workermysecuritycamerafrom-mnrackmazedyndns-blogis-a-bulls-fanwritesthisblogfreemyipsimple-urlfrom-sdreservdauthgear-stagingest-mon-blogueuris-into-gamesrice-labsxtooldevicesakurawebis-an-anarchistoraclecloudappsdyndns-worksells-for-urhcloudfrom-dcfastvps-serverwpmucdnis-a-geekscrysecfrom-txis-into-cartoonsmodelscapetrycloudflarelocaltonetstreak-linkbalena-devicesfrom-njforgeblocksfreebox-oswebadorsitefrom-ncdoesntexisthobby-sitestreaklinkshomesecuritymacownprovidertuleap-partnersdattorelaywphostedmailservequakeis-a-socialistservehalflifepivohostingdynuhostingquipelementsw-staticblitzdyndns-webfrom-deproject-studyaliases121is-not-certifiedhercules-devis-a-financialadvisoramazonlightsailservepicsis-a-greenloseyouripfrom-ilwithyoutubemwcloudnonprodwiredbladehostingdnsdojofrom-tnpixolinomyqnapcloudncloudstorageis-an-artisthostedpiis-a-landscaperauiusercontentoaiusercontenton-forgeis-a-conservativedreamhostersnet-freaksapps-1and1is-goneencoreapifastly-edgefrom-nesalesforcefrom-scdeployagentoraclegovcloudappsfrom-alis-a-lawyercechirevultrobjectsstufftoreadisa-geekddnsgeeklovableprojecttry-snowplowfrom-moblogsyteis-a-bookkeepernogmyforumravendbmyboxdeelementoredsaacficogoorinforgcomgobnatneteduidstoreorgcomnetintedudevnomepublorgcomneteduathgovtestscalculatorspaynowinfoquizzesresearchedcloudnsfunnelsassessmentsjscaleforcetmacltdorgmilcompronetgovbizpresseklogesrsccloudcustomfltusrcloude4corealmgovmunicontentproxy9metacentrumdyndyndyndnsdynpagespages-researchitionoccustomercomymyspreadshopipv64diskussionsbereich4limacomrub2ixfirewall-gatewayddnssspdnsbarsykeymachinesquare7myhome-serverspeedpartnercommunity-proschuldockxenonconnectg\xFCnstigliefernbwcloud-os-instancedyndnssecmy-routerxn--gnstigliefern-wobin-butterl-o-g-i-nisteingeekin-dslin-berlinin-brbfuettertdasnetzleitungsenin-vpnlcube-serverdyn-ip24logoipdyn-berlinruhr-uni-bochum12hpgoipsrvdnsfruskygit-repossvn-reposinternet-dnsg\xFCnstigbestellenhome-webserverxn--gnstigbestellen-zvbbplacedheimdnscosidnswebspaceconfiglima-citydyndns1istmeinvirtualuserschulplattformmy-gatewayddnsseclebtimnetztest-iservmein-iservvirtual-userhome64iservschuletaifun-dnstraeumtgeradeschulserverdynamisches-dns123webseitednshomehs-heilbronndnsupdaterbssgraphicdwadpdwdaepeweaawapaafpfwfabwbpbacwcpcciwebuserapiobjects*teamst3r2lpbravepanelngrokiservstglclcrmerpflypagesbarsyvivenushoplocalcertlocalplayerbearbloggatewaydeno-stagingis-not-ais-a-goodbotdashvercelmocha-sandboxplatter-appreplitgithubpreviewworkersinbrowserevervaultis-ahrsndenoxmitmodxmyaddrstorageapipayloadgrebedocruncontainersstgstagelclstageloginlineis-a-fullstackcodepenleapcellngrok-freeis-coolstoragewebharemediatechlibp2pdiscourseimaginecomyspreadshopstoreregbiz123hjemmesidefirmcoorgcomnetedugovsldorgmilcomwebgobartnetedugovtmorgpolcomsocartnetedugovassoagrondiscoodontk12medcuegyecpaabgengorgmilgalsaltulcomadmesmgobpubdocmonfindgnriouioproartlatvetnetfotedulojgovntrturibrbarxxxofficialbasechefprofmktgpsictechinfoarqtcontdentrrpppsiqgit-pagesritmedfieorgcomlibprieduaipgovriikmeactvsportorgmilcomscieunnetedugovnameinfopintouchtawktotawkmyspreadshoporgcomnomgobedu123miwebcomputeorgcomnetedugovbiznameinfocognito-idptransfer-webappeusc-de-east-1onjelasticnxaspdnsbarsydirectwpdeuxfleurstransurldogadoprvwcloudnsamazonwebservicesdnshomeuserpartycokoobinmkmfidymyspreadshopalandkapsiikixn--hkkinen-5wacloudplatformh\xE4kkinen123kotisivuidacorgmilcompronetedugovbiznameinforadioorgcomneteduuserexperts-comptablestmmyspreadshopgretaprdcomnomynhccifbxoshuissier-justicenotairesaeroportfreeboxoson-webavocatassoportgouvkdnschirurgiens-dentistes-en-franceavouesfbx-os123sitewebveterinairechirurgiens-dentistespharmacienchambagrimedecinfreebox-osdediboxgoupilemszicpyicpvicppleysheezypagesedugovcnpyorgcomcybllcpvtnetedugovtnxonlineschooldaemond6atcopanelorgnetplybotdashstackitkaasorgmilcomnetedugovbizmodltdorgcomedugovcoorgcomneteduappwriteacorgcomnetedugovcloudtranslateusercontentorgcomnetedumobiassoorgcomnetedugovbarsysimplesitediscourseindorgmilcomgobneteduorgcomwebnetedugovguaminfonxhra\u6559\u80B2\u654E\u80B2\u7DB2\u7D61\u7F51\u7D61\u7EC4\u7E54\u7D44\u7E54\u7F51\u7EDC\u7DB2\u7EDC\u7EC4\u7EC7\u7D44\u7EC7\u516C\u53F8\u653F\u5E9C\u500B\u4EBA\u4E2A\u4EBA\u7B87\u4EBAltdorgcomincneteduidvgovxn--uc0ay4axn--55qx5dxn--mk0axixn--io0a7ixn--uc0atvxn--zf0avxxn--lcvr32dxn--od0algxn--wcvs22dxn--gmqw5axn--od0aq3bxn--mxtq1mxn--ciqpnxn--tn0agxn--gmq050iorgmilcomgobneteduiservwp2tempurlmircloudfreesitewpmudevmyfastgadgetcloudaccessjelehalfboltfastvpsemergenteasypanelopencraftizcombrendlynamefromrtpersoadultmedorgpolrelcomproartnetedufirminfoassoshopcoopgouvtmcomediahotelforumvideosportorgsexagrargameslakaseroticaerotikatozsdereklamcasino2000filmsuliinfoboltshopprivnewsszexcityutazasjogaszkonyveloingatlaneacaicogoormy\u1B29\u1B2E\u1B36milwebschnetkopbizzonedesaponpesxn--9tfkymyspreadshopgovmytabittabitorderravpageaccok12idforgnetgovmuniltdplcaccotttvorgcomnetmeca6g5gpgamubacaicniocoukuptverdruscsdelhiindorgmilcomwebnicfingenpronetintedugovresbizbiharbarsyinternetbusinessschooltravelsupabasealumnigujaratfirminfoaeropostbankcoopindevscloudnsno-ipbarsybarrell-of-knowledgebarrel-of-knowledgensupdategroks-thisdnsupdatefor-ourknowsitalldvrcammittwalddynamic-dnsv-infowebhopselfipdyndnshere-for-moreilovecollegemayfirstforumzcloudnsmittwaldservertypo3servergroks-theeusekd1cdndyndnsidrawsainaueuapjpusstagemocksysdevicesclientcustreservdcustdevdisrecprodtestingcobeebyteutwenteboxfusebravepstmndedynngrokorgmilcomnomnetedugovqcxqzzbarsythingdustmo-siemensrb-hostingfh-muenstergitbookbluebitecloudbeesusercontentnodeartkiloappsforgerockdarklangresinstagingapigeebubbleb-datascryptedhypernodedappnodepantheonsitegitlabgithubkeeneticvirtualservercleverappshostyhostingon-rioedugitticketstelebitwixstudioon-k3sicp0icp12038jeleqotolairbubbleappsmyaddrstolosmyrdbxwebflowdrive-platformbeagleboardhasura-applolipopdefinimavaporcloudmusicianwebflowtestazurecontainerresindevicereadthedocsloginlineeditorxmoonscalesandcatsbasicserverwebthingsbrowsersafetymarkbeebyteappbitbucketidaccovistablogorgschnetgovxn--mgba3a4f16axn--mgba3a4fraarvanedge\u0627\u064A\u0631\u0627\u0646\u0627\u06CC\u0631\u0627\u0646jclaspeziapdudcefegelemeperetevebacanatavaparasabgagfgogrgpgalclblimfmrmcbmbvbfclcmcvcrcpcchlimifibicivipirisimncnbnanenrnpntnnolomobocoaogorosopotoptvtatctbtmtltotpusulunutpspapaqsvpvvvtvavvrtrsrprgrfrcrbrarorkrvstsssbscsmsispzczbzbozen-suedtirolmyspreadshopxn--bulsan-sdtirol-nsbxn--valledaoste-ebbtrentinoaltoadigetrentin-sued-tirolxn--forlcesena-c8axn--forl-cesena-fcbxn--bozen-sdtirol-2obtriestetrentinsuedtiroltrentino-s-tirollecceudineaostesienaparmaluccapaviagenoapaduaaostamonzaabruzzoternirietiturinmilanbozenlaziofermoleccocuneonuoropratola-speziavdataaligfvgpugmolcalcamlomumbsicpmnvenvaoedugovabrsarmaremrbastoslazibxosfirenzetrentinos\xFCdtirolval-d-aostavalle-aostamessinacremonaravennatoscanatrentin-suedtirolbolognacalabriaurbinopesarofriuli-v-giuliaogliastraxn--valle-aoste-ebblaquilaandriatranibarlettasyncloudxn--valle-d-aoste-ehbaostavalleyvalled-aostatrentino-alto-adigevallee-d-aostexn--balsan-sdtirol-nsbpistoiasicilialucaniacataniaiserniaperugiabresciaveneziagorizialiguriaimperiabulsan-suedtirolbalsan-suedtirolbarlettatraniandriaxn--trentino-sdtirol-szbforl\xEC-cesenatuscanyvall\xE9e-d-aostemantovavall\xE9e-aostecasertapiemontevalleaostaval-daostafriulivgiuliatrevisoforli-cesenavall\xE9edaosteferrarapescaravald-aostatrentino-altoadigefriuli-vegiuliavallee-aostecarboniaiglesiastarantomediocampidanovalleedaostetrentinosud-tirolcampobassotrentins\xFCd-tiroltrentinos\xFCd-tirolmonzabrianzatrentino-s\xFCdtirolxn--trentino-sd-tirol-c3bpotenzacosenzavicenzaemiliaromagnavenicefrosinonemarchepordenonetrentinosued-tirolvaresemolisevall\xE9eaostefriuli-veneziagiuliabasilicatalatinaanconasavonaveronamodenabiellabolzano-altoadigepugliafoggiaumbriatrentino-stirolgenovapadovamateranovararagusapiacenzatrentinostirolvalleeaostetempio-olbiasudsardegnatrentinsudtirolmassa-carrarafriuliveneziagiuliatrentinosuedtirolandria-barletta-tranitrapanixn--cesenaforl-i8amaceratacaltanissettaascoli-picenobrindisicarraramassacagliaririmininapolivibo-valentiachietibulsan-sudtirolbalsan-sudtiroltrentino-a-adigebulsanbalsaniglesiascarboniamilanotorinoteramodell-ogliastraarezzotrentinoalto-adigerovigotrentovenetoiglesias-carboniatrentino-sud-tirolaltoadigereggio-emiliareggio-calabriasardegnatranibarlettaandriapiedmontxn--sdtirol-n2amedio-campidanotrentino-s\xFCd-tirolfriuli-vgiuliafriuli-ve-giuliaromeennaromapisa32-b16-b64-blodiastibarineencomonaplesforlicesenailiadboxosalessandriasicilytrani-barletta-andriaxn--trentin-sdtirol-7vbpesarourbinotrentinsued-tirolcesena-forliforl\xECcesenaemilia-romagnamonzaebrianzaxn--trentinsdtirol-nsbtrentinos-tiroltrentins\xFCdtirolvalledaostaolbia-tempiocampidanomediovibovalentiasassarivalle-daostalombardysud-sardegnafriulivegiuliareggioemiliamonzaedellabrianzaalto-adigevercellitrentin-sudtiroltraniandriabarlettatrentino-sudtirolascolipicenobozen-s\xFCdtirolfriulive-giuliaflorencexn--cesena-forl-mcbcarbonia-iglesiasaosta-valleycarrara-massadellogliastratrentinoa-adigexn--valleaoste-e7apesaro-urbinoxn--trentinosdtirol-7vbxn--trentin-sd-tirol-rzbxn--trentinsd-tirol-6vbtrani-andria-barlettatrentin-s\xFCd-tirolxn--trentinosd-tirol-rzbgrossetomonza-e-della-brianzas\xFCdtirolreggiocalabriatrentinoaadigetrentin-s\xFCdtirolverbano-cusio-ossolafriuliv-giuliaverbaniacampaniatrentino-aadigefriulivenezia-giuliasardiniaandriabarlettatranibarletta-trani-andriacatanzarooristanourbino-pesarocesena-forl\xECvalle-d-aostacampidano-medio123homepagesiracusatempioolbiasuedtirollombardiaavellinocesenaforl\xECtrentinofriuli-venezia-giuliabozen-sudtirolandria-trani-barlettabulsan-s\xFCdtirolbalsan-s\xFCdtirolmonza-brianzabolzanotrentino-sued-tirolbellunosalernolivornocrotonesondriodnshometrentinsud-tirolmassacarraratrentin-sud-tiroltrentino-suedtirolviterbobergamocesenaforliolbiatempiopalermobeneventoagrigentoofcoorgnetfmaitvphdengorgmilcomschnetedugovperagrikanieasukehandachitatokaiaisaikonanoharuamaobuhigashiuraowariasahiinuyamatobishimaiwakurashitarainazawatoyonegamagorimihamatoyotataharakariyayatomioguchikomakimiyoshinishiotokonamekiyosuchiryutoyohashiokazakiisshikikasugaikotakiratoeianjotogofusosetohazutsushimashinshirotakahamanisshinshikatsuhekinantoyokawaichinomiyatoyoakeodateogataakitaikawakyowahonjoogayurihonjonoshirokamiokakatagamimitanegojomeyokotekosakadaisenkazunonikahohonjyomoriyoshimisatohappoukamikoanihachirogatahigashinarusesembokufujisatokitaakitaitayanagiowanitakkomutsutsurutahirosakigonoheoirasetowadamisawanohejiaomorishingohiranairokunohehashikamitsugarushichinohehachinohenakadomarisannohekuroishisakaeisumiasahiotakiinzaiabikomatsudoyachiyomutsuzawakujukuriomigawakashiwatoganemihamanaritasakuranagaramobarahanamigawachoshishiroichoseikozakishisuikatorimidorichonankyonanfuttsuonjukufunabashinagareyamanodasosatakochuotohnoshourayasukimitsuyokaichibayotsukaidosodegauratateyamakamagayayokoshibahikariyachimatakatsuuratomisatokisarazukamogawaichikawanarashinoichinomiyashimofusaminamibososhirakoichiharaoamishirasatoikatahonaiainansaijoseiyoiyoozuuwajimaniihamanamikatamasakiuchikokihokutobetoonshikokuchuomatsuyamaimabarikamijimakumakogenyawatahamamatsunosabaeikedaobamasakaifukuiohionotsurugamihamawakasaminamiechizeneiheijikatsuyamatakahamaechizensoedaukihaomutaokawanishiogoribuzenonojosueumiokiotochikugosasagurisaigawamizumakishinyoshitomikurumekurateyamadakasuganakamamiyamanogatatakatahakataiizukakawaratagawakasuyaashiyainatsukimunakataminamitsuikishonaikurogifukuchikeisenhigashimiyakoshinguyukuhashiokagakiyamekogaongausuikahotohochuotoyotsumiyawakadazaifuhisayamatachiaraiyanagawanakagawahirokawachikujochikushinochikuhochikuzennamieotamaokumashowateneiiwakikoorinangoononishigoshimogoomotegomishimafukushimaasakawakagamiishishirakawaiitatefutabahiratayugawahanawakitakatakawamatakunimiyabukibandaihigashihironoyamatomiharuyamatsuriaizubangedatesomaaizuwakamatsuyanaizuaizumisatonishiaizuizumizakikitashiobarataishinkaneyamakoriyamainawashirotanagurafurudonosamegawasukagawaishikawatamakawaikedaogakitaruiginanenahashimahichisonakatsugawaibigawashirakawamizunamiminokamomitakekawauesekigaharatomikasakahogikitagatayamagatatajimianpachimotosuyaotsukakamigaharahidakanisekitokigujominogodoyorogifukasamatsutakayamawanouchihigashishirakawakasaharashimonitatsumagoichiyodakannakanrashowameiwakiryuotaoratomiokafujiokaitakuranaganoharahigashiagatsumatakasakishibukawaminakamikatashinatsukiyonokawabanumataannakaoizumimidorishintoisesakiuenoyoshiokakusatsutakayamanakanojonanmokutamamuratatebayashimaebashiotakekaitadaiwahongofuchukuietajimashobaramiharahatsukaichihigashihiroshimamiyoshikumanokurenakasakaseraseranishiasaminamifukuyamashinichionomichiosakikamijimajinsekikogentakeharaotobenanaeikedatohmaozoraobiraabirakyowaeniwataikibibaisharirebunerimohiroooketootarupippunishiokoppechitosefurubirahakodateshiranukakitahiroshimakushiroobihironanporoiwamizawaniikappukunneppufukushimanakasatsunaitoyourakuromatsunaiakabirakamisunagawashibechaurakawakamifuranonakatombetsuasahikawashimokawakayabeokoppebiratoriabashirisaromaatsumanumatahidakabifukamukawamikasahorokanaitoyotomisarufutsuhigashikawaishikarikitamiyoichiesashiiwanaitomariminamifuranoakkeshifuranotoyakoyakumootoineppushikaoishiraoinemuronayorohaboroashorobihororishirifujiutashinaihokutotakasuebetsuurausuassabukikonaishimamakinaiedatetoyabieinikiesanuryuoumuteshikagarikubetsuashibetsukimobetsuaibetsutobetsusobetsuembetsushimizuchippubetsurishirihokuryuhoronobeshintokutsubetsushibetsuhonbetsumombetsutsukigatakuriyamakoshimizushiriuchikutchanmurorannoboribetsukamishihorowassamushinshinotsukembuchiwakkanaikamoenaikiyosatotakinoueshikabesunagawafukagawanakagawatakikawakamikawahigashikagurahamatonbetsumatsumaemoseushirankoshishakotanimakanemashikeotofuketomakomaisandatambaitamiawajikasaiasagoshisoonoakoyashirotoyookaminamiawajiinagawafukusakitakasagokamigorikasugaharimayokawaashiyahimejiakashitaishiaogakisannantakinosumototakarazukanishinomiyashingugoshikinishiwakiyokatakaaioimikisayoyabukawanishiamagasakisasayamashinonsenkakogawaichikawakamikawatatsunotsukubaiwamaogawaasahisakaitokaioaraiitakobandodaigosuifuinaamikasumigaurakashimaomitamayachiyoshimodatetomobetoridehitachinakainashikisakuragawakasamayawaramoriyahitachiomiyanamegatayamagatahitachikamisuushikutakahagiibarakitonekoganakasowayukimihojosomitoryugasakishimotsumafujishirotsuchiurachikuseihitachiotashirosatotamatsukuriuchiharashikahakuinanaotsubatawajimakahokukawakitatsurugikaganominotosuzuuchinadakomatsuanamizunakanotohakusannonoichikanazawaiwateshiwafudaikawaimoriokaofunatohanamakikuzumakikitakamininohekunoheyamadayahabasumitaichinosekitanohatahiraizumirikuzentakatajobojiotsuchihironomiyakoiwaizumikarumaiichinohenodakujitonooshushizukuishifujisawamizusawakamaishikanegasakimannoutazukotohiraayagawazentsujihigashikagawauchinomikanonjisanukimarugamemitoyotakamatsutadotsunaoshimatonoshoakuneamamiizumihiokiyusuikinkoisasookouyamanakatanekagoshimakanoyaisenkawanabeminamitanemakurazakitarumizunishinoomotematsumotosatsumasendaioimatsudaayaseebinamiurazushinakaiodawaraiseharasagamiharahakoneaikawakaiseiatsugitsukuihadanoyamatoyamakitazamaoisochigasakininomiyayokosukakamakuraminamiashigarafujisawasamukawakiyokawahiratsukayugawaraokawaumajikochitsunootoyoakiinonishitosayasudahidakamiharasakawaniyodogawahigashitsunokagamigeiseisusakiotsukinaharisukumomurototosakamiochitoyotosashimizumotoyamanankokunakamurakitagawayusuharaogunichoyoukiasoutoozugyokutoamakusamifunetakamoriyamagaminamataminamiogunikikuchisumotoyamatonagasumashikiaraokumamotokamiamakusanishiharayatsushiroayabeseikasakyoideineujinakagyokameokakyotangokyotanabekyotambaminamiyamashiroyamashinatanabeyawatawazukaminaminantanmiyazuhigashiyamafukuchiyamakitamukokamojoyokizumaizuruujitawaraoyamazakinagaokakyokumiyamakawagoeinabeshimameiwaasahitaikiudonoisetsukisosakikuwanamihamamiyamasuzukatamakimisuginabarikumanokomonominamiisewataraitobakiwatakikihotadomatsusakayokkaichikameyamaureshinoishinomakishichikashukuohirataiwaosakizaohigashimatsushimashikamaiwanumashibataogawaraonagawakawasakiseminemarumoriminamisanrikukakudamuratawakuyatomiyanatoriwataritagajomisatotomekamirifushiroishimatsushimayamamotoshiogamafurukawahyugaebinotsunosaitoayakushimanobeokakitauramiyazakitakazakigokaseshiibamimatashintomikunitomikitakatakobayashikawaminamitakaharukijotakanabemiyakonojonishimeranichinankitagawakadogawamorotsukakisofukushimaminamimakisakaeobuseikedaogawamiasaokayaasahiotakiotarichinoinaomichikumakomaganechikuhokukaruizawayasuokaooshikaikusakaminamiaikitogakushimatsukawakawakamitateshinatakamorikitaaikishiojirimiyadahakubaiizunaiijimaiiyamamiyotasuzakayasakatoguraookuwanagawaminowahirayayamagataminamiminowafujimiomachisakakitakaginaganonakanosakuhokomoronagisoshinanomachiwadauedaiidaharasuwatomiachiaokianankisosakunozawaonsenagematsutakayamashimosuwamatsumotoyamanouchinakagawamochizukiazuminotatsunoobamaomuraseihiunzenosetofutsuikichijiwanagasakiisahayahasamisaikaikawatanasasebohiradokuchinotsugototogitsutsushimashimabarashinkamigotomatsuurayamazoekashibaikomakawaitenrioyodosangokoryoudaojiikarugayamatokoriyamatenkawakatsuragikurotakikawakamimiyakemitsuetakatorikamikitayamayamatotakadahegurishinjokanmakisakuraitawaramotogoseoudanarasoniandokawanishishimoichihigashiyoshinokashiharashimokitayamanosegawayoshinomintsivorytopazsakuragehirnsumomoaseinetopalmail-boxmokurenyoitamuikaojiyagosensanjoaganomyokoseiroagaomishibataniigatanagaokamurakamiuonumayuzawakariwatagamitainaitsunanminamiuonumatochioyahikojoetsuseiroukamosadoizumozakitokamachiitoigawasekikawakashiwazakitsubamemitsukekokonoesaikiusukibeppuusahimeshimakunisakihasamataketatsukumihitaoitahijikusuyufukujukamitsuebungoonobungotakadaibaraniimibizentsuyamaokayamakasaokahayashimayakagemaniwaakaiwamisakishinjotamanotakahashikibichuowakesojanagishookumenannishiawakurakurashikiasakuchisetouchikagaminosatoshotomigusukunakagusukuyaeseizenaurumaiheyaaguniogiminanjokinminamidaitokitanakagusukuyonaguniokinawaishigakikunigamiurasoekadenataramahiraraginozataketomishimojizamamitonakiitomanhigashimotobuyonabarugushikamionnanahanagohaebarukumejimakitadaitonakijinnishiharayomitanginowantokashikiishikawaikedasuitaminohizuminishisakaikananabenodaitoosakasayamayaokishiwadatadaokakaizukatondabayashichihayaakasakakumatorikadomasayamahigashiosakashijonawatehirakatataishimisakitajirihannansennankatanotoyonominatosettsuhigashiyodogawaibarakinosekitachuohigashisumiyoshifujiiderakashiwaraizumiotsutoyonakamatsubaramoriguchiizumisanoshimamototakatsukineyagawahabikinotakaishikawachinaganoyoshinogarikamiminearitaouchiimarihizenogikashimaariakekiyamafukudomikitagatakitahataomachigenkaikanzakinishiaritakyuragisagataratosutakushiroishikaratsuhamatamakouhokukawagoeyoshidasatteogoseirumaasakaurawaogawaniizaomiyayoriiotakishikihonjooganohannohanyuinasaitamaokegawaarakawayoshikawayokozehasudasayamahidakafukayachichibuiwatsukiryokamiyoshimikamiizumifujimiwarabiranzanmiyoshiminanoyashiosakadosugitomisatohigashichichibutodasokakukiyonokazoshiraokakasukabekounosukawajimatsurugashimamiyashirokitamotohatoyamamoroyamahatogayakumagayakawaguchinagatorokamisatomatsubushinamegawatokigawakamikawafujiminohigashimatsuyamakoshigayatokorozawas3isk01isk02ryuohkoseikonanaishorittotakashimamaibarahikonetorahimenishiazaikokagamokotoyasuotsukusatsunagahamamoriyamatoyosatotakatsukinotogawaomihachimanhigashiomiakagiunnanizumogotsuamayatsukakakinokimatsuehamadamasudahikawahikimiokuizumoyasugiyakumomisatotamayuohdahigashiizumookinoshimanishinoshimatsuwanoshimaneshimadafujiedayoshidashimodagotembaiwataatamikosaiyaizuitoizumishimahaibaramakinoharaomaezakikawanehonkannamisusonohigashiizufukuroinumazukawazufujiaraishizuokahamamatsushimizuizunokunimatsuzakimorimachiminamiizunishiizukikugawakakegawafujikawafujinomiyaujiietsugaoyamayaitaohiranikkoashikagakuroisokanumasakurashioyakarasuyamamotegiichikaikaminokawatochigihagamokanogisanobatonasumibunasushiobaranishikatautsunomiyaiwafunemashikoshimotsukeohtawaratakanezawaitanokomatsushimatokushimaichibaminamiaizumiwajikikainanmiyoshinarutomimamugiananmatsushigesanagochishishikuinakagawamachidachiyodakomaefussainagitaitochofufuchuomeotahigashiyamatotoshimaokutamaaogashimakodairaedogawaarakawahachiojishinagawatachikawashibuyasuginamihinodekiyosesumidaoshimanerimamitakahamuraadachinakanomizuhobunkyomegurominatokoganeihigashikurumekokubunjihigashimurayamamusashimurayamatamakitahinochuokotokatsushikakouzushimaogasawaraakishimakunitachishinjukusetagayamusashinohachijoitabashiakirunohinoharachizunanbukotouramisasawakasayonagokogehinoyazutottorinichinansakaiminatokawaharaoyabetairainamiasahinantoimizufuchutakaokakurobeyamadajohanatoyamatonaminyuzenfunahashinakaniikawanamerikawaunazukitogahimiuozufukumitsutateyamakamiichiiwadearidayuasainamitaijikatsuragiaridagawatanabemihamahidakakainankiminomisatoshingushirahamakamitondayurakozakoyagobokitayamawakayamakudoyamahashimotokushimotokozagawahirogawakinokawanachikatsuurarsuseroeoishidasagaeoguniasahinagaitendonanyoobanazawanishikawasakataohkuratozawamikawamamurogawayamagatafunagatatakahatashonaishinjokahokuiideyuzakawanishitsuruokakaminoyamayamanobeshiratakamurayamanakayamakaneyamahigashineyonezawasakegawamitouubeyuuabushimonosekitabuseoshimatoyotaiwakunihikarishunannagatohagihofukudamatsutokuyamashowadoshitsurunanbukoshukaiminami-alpsnirasakikosugeotsukioshinohokutominobuyamanashifuefukichuokofuichikawamisatoyamanakakonakamichitabayamanishikatsuranarusawafujikawahayakawafujiyoshidafujikawaguchikouenohara\u9577\u91CE\u4EAC\u90FD\u5C90\u961C\u5927\u962A\u4E09\u91CD\u7FA4\u99AC\u5343\u8449\u6ECB\u8CC0\u4F50\u8CC0\u5948\u826Fadednelgaccogogror\u79CB\u7530\u611B\u77E5\u9AD8\u77E5\u57FC\u7389\u6C96\u7E04\u6803\u6728\u718A\u672C\u5CA9\u624B\u9752\u68EE\u5C71\u68A8\u65B0\u6F5F\u5CF6\u6839\u9CE5\u53D6\u9577\u5D0E\u9999\u5DDD\u5BAE\u57CE\u77F3\u5DDD\u5927\u5206\u5BAE\u5D0E\u8328\u57CE\u5C71\u53E3\u5175\u5EAB\u5C71\u5F62\u5FB3\u5CF6\u5E83\u5CF6\u798F\u5CF6\u798F\u5CA1\u5CA1\u5C71\u5BCC\u5C71\u9759\u5CA1\u611B\u5A9B\u798F\u4E95\u6771\u4EACxn--4it168dhatenadiaryxn--vgu402ckawaiishophatenablogcocottenamaste\u5317\u6D77\u9053penneehimeiwateversestabachibashigagonnagunmapermahaccaakitaosakauh-ohblushkochiaichifukuikuroncapooitigohyogotokyokyotopunyuthickcheap0t00g00j0mie2-ddaapyawjg0amfemsubxiiboomoobutchueekpgwrgrherskrboyrdyupperunderflierchipsmydnsheavyangryhippygirlyrulez\u795E\u5948\u5DDD\u9E7F\u5150\u5CF6\u548C\u6B4C\u5C71bambinaxn--nit225kokayamasaitamaxn--k7yn95exn--1lqs03nsapporoparasitelolipopmcxn--efvn9sniigatafukuokatokushimafukushimahiroshimakagoshimafakefurokinawaxn--8pvr4ucoolblogxn--0trq7p7nnkawasakinagasakimiyazakichilloutxn--8ltr62kxn--klty5xpeeweezombiecutegirlxn--rny31hxn--uuwu58axn--ntso0iqx3axn--djrs72d6uytoyamanikitanyantakagawamimozanagoyaboyfriendxn--2m4a15egreaterchowderegoismyamagatafashionstorexn--elqq16hxn--pssu33lsendaimiyagixn--rht27zpecoriaomorisaloonwatsonvivianxn--djty4knobushipigboatnaganopinokoxn--f6qx53asadistvelvetsecretxn--5js045dchicappayamanashiibarakidigickgirlfriendxn--1lqs71dmongolianxn--c3s14mxn--qqqt11mtochigixn--5rtq34kparallelo0o0mondkobesagabonadecaoitanarafoolkilldecimainhiholomosblokilociaoundopupugifutankcrapflopnooroopsmodsholyjeezstripperpepperbittershizuokaxn--rht3dkitakyushureadymadeicurusversusmatrixxn--rht61ehungryfloppygloomycrankyhandcraftedlittlestarxn--klt787dxn--kltx9awhitesnowsunnydaytottorilovepoptheshopbuyshopxn--5rtp49cxn--d5qv7z876cwebaccelxn--kbrq7oxn--4pvxsxn--1ctwolovesickkumamotocatfoodxn--tor131oyokohamawakayamatonkotsuxn--ehqz56nxn--uist22hxn--6btw5axn--kltp7dyamaguchifrenchkisspussycatxn--4it797kxn--uisz3gbabybluexn--zbx025dnetgamersxn--7t0a264ckanagawaxn--6orx2rishikawaxn--ntsq17ghalfmoonschoolbusjellybeanxn--mkru45iusercontentlolitapunkxn--32vp30hsakurastoragehokkaidoshimanecandypopbabymilksupersaleweblikeraindropbackdropwebsozaikikirarahateblodaynightmeneacsccogoormobiinfoaeusxxorgmilcomnetedugovorgcomnetedugovbizinfotmprdorgmilcomnomedugovassnotairespresseassocoopgouvveterinairemedecinpharmaciensorgnetedugovtraorgcomedurepgovmeneperekgacscaiiocogoitoresmshsseoulbusanulsandaeguc01milvkimmvchungnamjeonnamjeonbukeliv-dnsgyeonggijejueliv-cdnincheondaejeongangwongyeongbukgwangjuchungbukgyeongnameliv-apicoeduindorgcomembnetedugovorgmilcomnetedugovjcloudorgcomnetintedugovperbnrinfocooyorgcomnetedugovethipfscanvamypepethw3sstorachakeeneticjoinmcinbrowserdwebcyonnftstoragemyfritzaemewphlxachotelltdorgcomwebsocschngonetintedugrpgovassnomgacsccoorgnetedugovbizinfo123websiteidorgmilcomasnnetedugovconfidmedorgcomplcschnetedugovaccoorgnetgovpresstmassoirseproxaccosoundcasthoptocraftvp4c66orgnetedugovitsmcdirmyboxbarsyedgestacksynologylogintoopencloudnohostwebhopdiskstationi234tcp4hoocgroknoipprivmydsddnsdnsforlohmustransipdscloudfilegear-sgbrasiliafilegearframerbarsybarsyonlinecoprdorgmilcomnomedugovinforgcomnetedugovnameacprorgcomartnetedugovpresseinfoassoinstgouvorgnycedugovbarsydscloudjuorgcomnetedugovminisiteaccoororgcomnetgovorgmilcompronetintedugovbizmuseumnameinfoaerocoopaccoorgcomnetintedugovbizcooporgcomgobneteduorgmilcomnetedugovbiznameaccoorgmilneteduadvgovcoorgcomnetaltgovforgotherhiskeeneticispmanagernomassoprod5476132eastasiacentraluswesteuropewestus2eastus2pnortheurope-01newzealandnorth-01southindia-01southcentralus2-01norwaywest-01eastus2-01westus2-01australiaeast-01italynorth-01israelnorthwest-01swedencentral-01westeurope-01centraluseuap-01taiwannorthwest-01uaecentral-01northcentralusstage-01israelcentral-01mexicocentral-01canadacentral-01austriaeast-01germanywestcentral-01francecentral-01ukwest-01denmarkeast-01polandcentral-01eastus-01westus-01swedensouth-01eastus3-01westus3-01brazilsouth-01centralus-01francesouth-01australiacentral-01westindia-01uaenorth-01jioindiacentral-01canadaeast-01belgiumcentral-01spaincentral-01koreacentral-01chilecentral-01qatarcentral-01westcentralus-01eastus2euap-01norwayeast-01southafricanorth-01brazilsoutheast-01germanynorth-01switzerlandnorth-01switzerlandwest-01japanwest-01southafricawest-01japaneast-01eastasia-01indiasouthcentral-01taiwannorth-01centralindia-01uksouth-01southcentralus-01northcentralus-01eastasiastage-01indonesiacentral-01australiacentral2-01australiasoutheast-01malaysiawest-01koreasouth-01southeastasia-01southeastus5-01northeastus5-01jioindiawest-01rucdnwest1-usfra1-desandboxjls-sto1jls-sto3jls-sto2aglobalabglobalsslmapprodfreetlsmapvpslon-1lon-2ny-1fr-1sg-1ny-2paassnwebpaashostingjelasticnordeste-idcsocuserpagescwebfileblobservicebuscoreatlricnjsjelasticwebsitestoragesezagbinruhuukjptsmyspreadshopmynetnameakamaiorigin-stagingfrom-coipv64dynv6cdn77serveblogadobeaemcloudhicamsprytdnsupno-ipownipde5ovhicpfirewall-gatewaysytesmypsxbarsyusgovcloudapimyamazemyradwebakamaihdsaveincloudfastlylbfrom-lasubsc-paysquare7in-the-bandblackbaudcdnhomelinuxoninfernoctfcloudservebbsdns-dynamiccloudfrontakamai-stagingipifonyham-radio-opsenseeringclickrisingcommunity-profrom-nylocalcertgrafana-devedgesuite-stagingcloudflareanycasteating-organicatlassian-devmydattofeste-iplocaltotorprojectknx-serveredgekeycloudflareglobalcloudyclustercasacamserveftpakamaized-stagingakamaiorigindns-cloudmyeffectboomlabotdashbuyshousestwmailhetemlazure-mobilein-dslthruhereredirectmedynuddnsbouncemesupabaseluyanicloudappakamaicloudfunctionsdebiannhlfanpgafanstatic-accessin-vpnmysynologymafeloappudohomeftptrafficmanagersiteleafseidatmemsetcloudflarecloudaccesskeyword-onazure-apiis-a-chefdoes-itgets-itwebhopselfiphomeipkicks-assedgesuitewindowsserver-ontunnelmolemydissentscrapper-sitecloudflarecnuni5srcfggffiobbzabchrsndenodynuopikddnsvpndnsakadnselastxkinghostvps-hostfastlyhomeunixazureedgeshopselectdontexistmyfritzcloudjiffyalwaysdatasells-itsquaresbroke-itazurefddattolocalat-band-campmeinforumfamilydsazurestaticappsdefinimabplaceddnsaliasdynaliasnow-dnsblogdnsroutingthecloudendofinternetdsmynasakamaiedgemymediapcadobeio-staticakamaiedge-stagingakamaihd-stagingddns-ipprivatizehealthinsurancelive-onkrellianschokokeksmassivegridmysecuritycamerarackmazeserveminecraftfrom-azis-a-geekakamaizedmoonscaleoffice-on-theusgovtrafficmanageradobeioruntimeedgekey-stagingreserve-onlinechannelsdvrdnsdojousgovcloudappcdn77-sslapps-1and1podzoneazurewebsitesdynathomescaleforceyandexcloudvusercontentisa-geekcdn-edgescoaemalcesappwriteazimuthtlonarvobuiltwithrocketnoticeablestorecomwebrecnetperotherfirminfoartslgdloncogoiltdorgmilcolcomplcschgenngonetedugovbiznamefirmmobiacincoorgmilcomnomwebgobnetintedubizinfocomyspreadshopdemongovtransurl123websitehosting-clusterkhplaycistrongsnesosvalerv\xE5lerxn--vler-qoaossandeheroysandeher\xF8yb\xF8boheroyher\xF8yxn--hery-iraxn--b-5gavalerb\xF8boxn--b-5gasandesandexn--hery-iraxn--vler-qoav\xE5lerh\xE5re\xE5laahavaofsfvfhlolnlalrlhmfmtmahcostntbu\xE5strmreigersundmyspreadshopg\xE1ls\xE1eidsvolltingvollgildeskalflor\xF8vads\xF8vard\xF8vanylvenxn--bhccavuotna-k7astrandaxn--kvnangen-k0axn--sknland-fxaxn--mosjen-eyarakkestadhyllestadnannestadvevelstadvaapstenordre-landsondre-lands\xF8ndre-landtjieltexn--vrggt-xqads\xF8r-aurdalsor-aurdalheradstordmoldefordef\xF8rdeseljefedjeryggehemnexn--krehamn-dxasognegranes\xF8gnebrynetjomevallebykletokkegiskedovretj\xF8mehob\xF8lvoldasaudatolgas\xF8mnaviknad\xF8nnasomnadonnatranafrananesnaraumasmolatr\xE6nafr\xE6nalesjasm\xF8la\xF8rstaorstahitrafloraaukraloppafr\xF8yarissasnasahalsagalsaromsaraisar\xE1isafroyasn\xE5sagronghobolfjelltydal\xE5rdalardalaskimharamkraanghkekr\xE5anghkesorumbarumhurumb\xE6rums\xF8rummodums\xE1l\xE1tb\xE1l\xE1tfrognbjugnv\xE5ganvagangulenskienl\xF8tenlotenstrynvefsnxn--merker-kuaskaunsveiob\xF8mlobomloskj\xE5kvardoflorovadsosalatbalats\xE1latkl\xE6buklabuselbubarduulvikskjakkleppris\xF8rxn--nttery-byaefl\xE5eidflahofmilgolholsellomskifetvikdepvgsfhsaskerrisorhamarasnes\xE5snesr\xF8rosrorosxn--slat-5namasoynaroyvaroyluroydyroyaskoyradoyandoyrodoymeloyrad\xF8yand\xF8yr\xF8d\xF8ymel\xF8yask\xF8ylur\xF8ydyr\xF8ym\xE5s\xF8yv\xE6r\xF8yn\xE6r\xF8yhoylandeth\xF8ylandetdivtasvuodnal\xF8renskoglorenskognesoddtangenxn--tjme-hraxn--smla-hraxn--stjrdal-s1aunjargalillehammerunj\xE1rgaxn--hamary-fyadavvenjargaxn--bearalvhki-y4a123hjemmesidegjerdrumxn--brnnysund-m8acxn--tnsberg-q1axn--mlatvuopmi-s4axn--snsa-roaxn--skierv-utaxn--brum-voatysfjordkvafjordeidfjordkv\xE6fjordsongdalenmjondalenmj\xF8ndalenxn--gls-elackragerog\xE1\u014Bgaviikagangaviikas\xF8rreisasorreisas\xF8r-varangersor-varangerxn--risr-iraskiervaxn--frna-woaxn--trna-woakvinesdalleksvikleirvikr\xF8yrvikroyrviksvelvikvenneslaevje-og-hornnessandnessj\xF8enmarnardalvindafjordsandefjordenebakksnillfjordullensvangxn--trany-yuabr\xF8nn\xF8ysundnamsskoganaustevollxn--stjrdalshalsen-sqbnord-aurdalnord-frontr\xF8gstadtrogstadgrimstadflakstadgjerstadxn--sandy-yuaxn--leagaviika-52bnore-og-uvdalvegarsheixn--rlingen-mxaxn--ggaviika-8ya47hveg\xE5rsheikarlsoykvitsoymasfjordenhamaroyinderoyosteroydavvenj\xE1rgasauheradguovdageaidnuxn--vre-eiker-k8abronnoysiellakkr\xF8dsheradkrodsheradkvinnheradbr\xF8nn\xF8yxn--mtta-vrjjat-k7afxn--lrenskog-54akvits\xF8yv\xE1rgg\xE1tkarls\xF8yoster\xF8yinder\xF8yhamar\xF8ybronnoysundxn--aurskog-hland-jnbbahccavuotnab\xE1hccavuotnagiehtavuoatnastor-elvdalmidtre-gauldalxn--gildeskl-g0akarasjokevenassixn--bievt-0qaxn--yer-znalebesbynessebyxn--hbmer-xqamalselvm\xE5lselvxn--unjrga-rtam\xF8re-og-romsdalmore-og-romsdalhareidmeland\xF8rlandorlandstrand\xE5lg\xE5rdsolundalgardafjord\xE5fjorddielddanuorrikautokeinoxn--stre-toten-zcbskodjeaejriestangeliernebamblestokkefauskesn\xE5asesnaasekongsvingerlangevagberlevagxn--flor-jrahattfjelldalostre-toten\xF8stre-totenvestfoldxn--mely-ira\xE1laheadjualaheadjunordreisaxn--troms-zuaxn--lgrd-poacporsangerflatangerstavangerleikangerbremangersamnangergieldakarasjohkaxn--rdy-0nabfrostautsirasnoasatromsaxn--sr-aurdal-l8aflekkefjordj\xF8lsterjolsteraremarkhedmarkn\xE5\xE5mesjevuemienaamesjevuemiexn--vard-jrarollagmer\xE5kermerakerorskog\xF8rskogxn--bdddj-mrabd\xE1k\u014Boluoktaxn--osyro-wuaaknoluoktatrysilskjerv\xF8ymandaljondalbindalrindalmeldalsuldalorkdalsigdalalvdall\xE6rdalhurdalsirdalverdallerdallardaloppdal\xE5seralaseralhadselkrager\xF8divttasvuotnaoverhallasteinkjerxn--hnefoss-q1askedsmokorsettroms\xF8xn--dyry-iravestre-totenmuseumxn--sandnessjen-ogbrahkkeravjufylkesbiblb\xE1jddarbajddarxn--laheadju-7yarennes\xF8yxn--koluokta-7ya57hxn--hgebostad-g3aleirfjordstorfjordbalsfjordb\xE5tsfjordbatsfjordmuos\xE1tbiev\xE1tloab\xE1tk\xE1r\xE1\u0161johkan\xF8tter\xF8yxn--mjndalen-64anordkappl\xE1hppilahppialstahaugsiljanverranr\xF8ykenroykenhaldenlyngenbergenhortenh\xF8nefosshonefosstroandinbeiarnvarggatosoyroos\xF8yrotromsoidrettmuosatbievatruovatloabatvoagattynsetnessetxn--indery-fyask\xE1nitskanitraholtr\xE5holtxn--ystre-slidre-ujbandebusarpsborgbearduxn--karlsy-fyahordalandjorpelandj\xF8rpelanddeatnuringsakers\xF8r-odalsor-odalxn--slt-elabringerikeaudnedalnittedalnissedalhemsedalslattumsurnadalxn--blt-elabelverumstj\xF8rdalnaustdalhjartdalgj\xF8vikfyresdalhasviknarviklarvikgjovikmalvikgamviklenvikporsgrunnstjordalengerdaldrobakdr\xF8bakxn--msy-ula0hvestvagoyxn--vgan-qoaxn--ryken-vuaxn--lten-graxn--stfold-9xaxn--hpmir-xqaxn--lury-iram\xE1latvuopmimalatvuopmitysv\xE6rkirkenesbirkenesmoskenesb\xE1id\xE1rxn--fjord-lraxn--rdal-poabahcavuotnab\xE1hcavuotnaxn--frde-gralind\xE5sbearalvahkixn--hobl-irar\xE1hkker\xE1vjuxn--loabt-0qav\xE5g\xE5\xE1lt\xE1bod\xF8sundlundrader\xE5deetnetimeholeauregrueoddavagavegaranatanaarnasolasulaaltalekafusavangbergkvam\xE5mliamlibokntinnroangranosenoslobodor\xF8stroststat\xE5motamotivgupriv\xF8yeroyerliermossvossxn--nvuotna-hwalusterlunnermarkerh\xE1bmerhabmerhvalerfjalerxn--rholt-mratysvarbaidarfitjargaularh\xE1pmirhapmirmelhusfosnes\xF8ksnesoksnestysneshemnesevenesflesbergeidsbergtonsbergt\xF8nsberglindasxn--sndre-land-0cbnamsosxn--srum-gra\xF8ystre-slidreoystre-slidrevestre-slidretrondheimbalestrandxn--langevg-jxaaustrheimxn--skjk-soavagsoyaveroysandoykarmoyfinnoytranoyvestbytranbysykkylvenxn--hyanger-q1aspjelkavikandasuoloxn--fl-ziaxn--drbak-wuastathellexn--sr-varanger-ggbtelemarkxn--bhcavuotna-s4axn--porsgu-sta26f\u010D\xE1hcesuolocahcesuoloakrehamn\xE5krehamnsand\xF8ykarm\xF8yfinn\xF8ytran\xF8yv\xE5gs\xF8yaver\xF8ynamdalseidxn--lesund-huabadaddjaxn--vegrshei-c0axn--btsfjord-9zagildesk\xE5lporsanguxn--trgstad-r1an\xE1vuotnanavuotnahammerfestxn--sgne-graxn--brnny-wuacibestadharstadnarviikaeven\xE1\u0161\u0161ivestnesgjemnessandnesagdenesrennesoyxn--avery-yuaxn--tysvr-vrabearalv\xE1hkikongsbergspydebergrandabergxn--andy-iradavvesiidaxn--krdsherad-m8apors\xE1\u014Bgufredrikstadbjerkreimringeburennebuaurskog-holandnotteroyxn--vgsy-qoa0jxn--rmskog-byaskierv\xE1ivelandbyglandfrolandaurlandforsandxn--bjddar-ptamidsund\xE5lesundalesundfetsundfarsundovre-eiker\xF8vre-eikerakershusxn--moreke-juas\xF8rfold\xF8stfoldostfoldsorfoldh\xF8yangerhoyangerlevangerorkangertanangerxn--vestvgy-ixa6olillesandulsteinxn--rennesy-v1agranvinskjervoyxn--klbu-woalavagisxn--h-2faxn--ryrvik-byakafjordk\xE5fjordseljordfolkebiblxn--gjvik-wuajevnakerxn--kfjord-iuabudejjuxn--kranghke-b0axn--davvenjrga-y4axn--rland-uuaxn--ldingen-q1axn--mlselv-iuaxn--rady-iraxn--linds-prabrumunddalxn--ygarden-p1amo-i-ranaeidskogr\xF8mskogromskoghjelmelandxn--finny-yuaxn--sr-odal-q1axn--skjervy-v1aballangenkvanangenkv\xE6nangengratangenxn--hmmrfeasta-s4acvossevangensuohkanxn--rde-ulaxn--mli-tlaxn--ksnes-uuanordlandskanlandsk\xE5nlandsortlandfuoiskuxn--rros-graxn--hcesuolo-7ya35bxn--eveni-0qa01gagaivuotnag\xE1ivuotnaxn--seral-lradrammenmodalenmosjoenjan-mayentorskensteigengloppenxn--snes-poamatta-varjjatxn--sr-fron-q1aomasvuotnajessheimb\xE5d\xE5ddj\xE5xn--krager-gyaxn--kvfjord-nxaxn--asky-iraxn--snase-nraxn--bidr-5nacholt\xE5lenxn--vads-jraxn--jlster-byamosj\xF8enxn--rst-0nastavernxn--ostery-fyaxn--oppegrd-ixaxn--sknit-yqaxn--risa-5naoppeg\xE5rdskiptvetrendalenholtalenxn--mot-tlaxn--lhppi-xqaxn--holtlen-hxaxn--srreisa-q1akopervikxn--muost-0qaxn--bmlo-grahokksundkvalsundegersundxn--karmy-yuaullensakerxn--hylandet-54axn--kvitsy-fyaxn--bod-2nalangev\xE5gberlev\xE5gkristiansandxn--rsta-frahornindalstj\xF8rdalshalsenstjordalshalsensandnessjoenh\xE1mm\xE1rfeastaxn--lrdal-sras\xF8r-fronsor-fronnord-odalkristiansundm\xE1tta-v\xE1rjjatvestv\xE5g\xF8ynesoddennotoddenbuskerud\xF8ygardenoygardensalangenlavangenralingenr\xE6lingenlodingenl\xF8dingenlea\u014Bgaviikalaakesvuemieleangaviikauenorgexn--srfold-byaaskvollxn--rskog-uuaxn--nry-yla5gxn--vry-yla5ghammarfeastaxn--rhkkervju-01afxn--givuotna-8yakommunekrokstadelvanedre-eikerhagebostadh\xE6gebostadxn--berlevg-jxakviteseidxn--s-1faxn--l-1faxn--nmesjevuemie-tcbafuosskomo\xE5rekemoarekexn--lt-liacxn--jrpeland-54asvalbardoppegardholmestrandtvedestrandsogndalsokndalarendalsunndalfolldalxn--krjohka-hwab49jlyngdaletnedalnorddalsaltdalgausdalskedsmovaksdalgjesdalstordalxn--frya-hraaarbortedrangedalxn--smna-graaurskog-h\xF8landxn--vg-yiabtjeldsundhaugesundlindesnesxn--mre-og-romsdal-qqbxn--dnna-gradyntmpheremerseineshacknetenterprisecloudmineaccomaorim\u0101oriorgmilcriiwigennetschoolhealthkiwigovtgeekxn--mori-qsacloudnsparliamentcomedorgcompronetedugovmuseumwebsitekinservicebarsywebsitebuildereerobookheimdnsleapcelleero-stagetechcrscsslorigingohomecdbedeeeiemesecabgngilnlalplchfisiincnnoroptatitmtltruauhulumkdkukskjplvtrgrfrkrhrusesismycynzcznetinteduassoososcloudstgbetaaezaeuhkusjshatenadiarycdn77hoptozaptois-a-knightmyftpno-ipjpnddnssdpdnsspdnsbarsysweetpepperis-a-bruinsfanis-very-sweetservegameis-a-soxfanhomelinuxcdn77-secureservebbsmisconfusedwebredirectblogsitefreedesktopcouchpotatofriestoolforgeaccesscamis-lostreadmyblogsmall-webfedorapeopleserveftpis-a-celticsfanmywirepotagertwmailin-dslsellsyourhomeread-booksfreeddnscable-modemis-savednflfanufcfanmlbfanstuff-4-saleendoftheinternetin-vpnmy-firewallhomeftpis-localis-a-chefboldlygoingnowherewebhopselfipkicks-assroxatunkcamdvrfedoraprojectgotdnsdvrdnsdyndnspubtlspimientahomeunixdontexistfedorainfracloudwmflabsfspagesbmoattachmentsteckidsfamilydsdnsaliasdynaliasnow-dnscloudnsdoomdnsduckdnsblogdnshomednsroutingthecloudendofinternetdsmynasip-dynamicpoivronhttpbinmyfirewallis-very-evilmysecuritycamerais-a-linux-userwmcloudis-a-geektuxfamilyis-a-candidatedoesntexistis-very-badhobby-sitegame-hostaltervistais-foundis-a-patsfandnsdojohepforgepodzonedynservcollegefanis-very-goodfrom-meis-very-niceisa-geeknerdpolacmedsldingorgcomnomgobabonetedupleskaemhlxmyboxrockyprvcydeuxfleurspdnscodebergheyflowstatichostorgmilcomnomgobneteduorgcomeduiorgmilcomngonetedugovcloudns1337ngrokacorggogfamcomwebgobnetedugokgopgkpgovgosbizpasaugumicsopozpapuwmwsrprusiskwpspkppspkmpspokeoiawsawifoumsdnskokwpmuppuppsppiwwiwoowuzswkzoschrzpisdnwzmiuwwitdpssewsseumigugimoirmpinbwinbwiihupporzgwgriwupowwskrwioswuozstarostwokonsulattmpccopruszkowmyspreadshopostrodakartuzyopolegminamediaustkazgorajgoraolawailawalomzawloclradombytomjaworznotargilubinkoninzagantorunkutnokepnonakloczestsopotsanokturekplockslasksklepzarowlukowmedaidgdaorgmilrelcomnomatmgsmartneteduelkgovwawsossexbiztgorysejnytychypomorzeboleslawiechomesklepsdscloudunicloudzakopanelegnicarawa-mazbydgoszczswidnikkrasnikwloclawekbielawamragowograjeworealestatebeskidykaszubymalopolskaprzeworskswiebodzinlecznadfirmaszkolawarmiagdyniamiastakazimierz-dolnymalborkswidnicadlugolekaostrolekapodlasieelblagtravelsimplesitezachpomormielecszczecinnieruchomosciwalbrzychlezajsklublinbedzinpoznanwielunmielnooleckostarachowicedkontopowiatwroclawrybniksuwalkileborkslupskgdanskostrowwlkptarnobrzegtourismwegrowkrakowglogowyou2pilanysamailwrocinfoagroautobeepshoppriviqhslapypiszlodzcfolksecommerce-shopmazurypulawyskoczowrzeszowpomorskiezgierzkaliszolkuszlowiczostrowiecsosnowiecmazowszewodzislawbialowiezazgorzeleckatowicepabianicejelenia-gorawolominkarpaczsieradznowarudaczeladzkonskowolaskierniewiceswinoujscieturystykabieszczadycieszynketrzynolsztynbialystokbabia-goraprochowicewarszawastalowa-wolapolkowicegorlicegliwiceponiatowalimanowalubartowaugustowkobierzyceopocznognieznoszczytnokolobrzegshoparenapodhalebielskoklodzkostargardatwithplayitownnamecoorgnetedugovacorgcomproestnetedugovbiznameislaprofinforechtngrokmedaaaacacpaenglawjurbarbarsykeeneticavocatacctcloudnsorgcomsecplonetedugov123paginaweborgcomnetintedugovnomepublidkinbarsygovx443cloudnsorgmilcomnetedugovcooporgmilcomschnetedugovnamecomcannetlibassoaemclantmcontstoreorgcomnomrecwwwbarsyfirminfoshopartsstackitmyddnswebspacelima-cityacincooxorgedugovbarsybrendlyhbvpsvpsspectrumlandinghostingacppmordoviamcprecbgorgmilcomspbnetintedumsknovgovbirrasmcdirmytismircloudvladimirnalchikadygeyamarinepyatigorskmyjinobashkiriaeurodirvladikavkazna4ugroznykustanaikalmykiacldmaildagestaniranbuildcloudcanvaliaravalwixdevelopmentappwritemigrationneedleverceldatabasestackitcodereplravendbonporterlovableaccoorgmilnetgovcoopmedorgcompubschnetedugovservicemecomygovorggovtvmedorgcomnetedugovinfoedgfacbmlonihkutwpsryxzbdtmacfhppmyspreadshopbrandpartiorgcomfhvpress123minsidaitcouldbeworlanbibkommunalforbundfhskiopsyskomvuxkomforbnaturbruksgymnloginlineorgcomnetedugovenscaledeuusentsurgebotdaorgmilcomnetgovnowteleporthashbangplatformlovablebarsyshopwarebasehoplixbarsyonlinemsf5gitpagewawamscofigma-govcaffeinefigmacanvasoltstscwputerbarsysupportchatgptsquareomniweopensocialcpanelplaycodenotionnovecorewpsquaredpreviewjelecyonbyensrhtfastvpspieboxconvexjouwwebheyflowplatformshloginlinemadethissourcecraftclouderaorgorgcomartedugouvunivmeorgcomnetedugovsurveysstatichfheiyuxs4allprojectmyfastubervibehostapp-ionosdeployagentmecoorgcomschnetedugovbizcncostoreorgmilcomneteduembaixadaconsuladokiraranohoprincipesaotomeheliohobarsystorebaseshopwaresellfyaiabkhaziavologdamordoviapenzalenugsochinavoiexnetspbmsknovnorth-kazakhstanashgabadkareliaarmeniageorgiavladimirnalchikivanovobukharaadygeyakhakassiakalugakrasnodarjambylaktyubinsktroitskbryanskobninskkurganazerbaijanpokrovskbashkiriatselinogradvladikavkazmurmansktulatuvamangyshlaktashkentchimkentgroznykaragandatermezarkhangelskkustanaikalmykiabalashoveast-kazakhstankaracoldagestantogliattibarsyredorgcomgobedumirenaccoorgjelasticdiscoursecleverappsschacmiincogoornetonlineshopcogoorgmilcomwebnicnetintedugovbiznametestcoorgmilcomnomnetedugovorangecloudpersoindorgcomfinnatnetgovensmincomtourismintlinfox0611oyaorgmilcomnetedugovquickconnectvpnplusnettprequalifymeaddrmyaddrntdllwadlnctvavdrk12orgmilpolbeltelcomwebgennetedutskkepgovbbsbiznameinfocoorgmilcompronetedugovbiznameinfobetter-thanworse-thansakurafromdyndnson-the-webmymailerorgmilurlcomneteduidvgovmydnsgameclubebizmeneacsccogotvorhotelmilmobiinfovodteiflgplkmsmsbcckhincndnvncoztltmkckppzpdprvcvkvlvcrkrkscxuzchernovtsyrivneyaltaodesavolynrovnolutskltdinforgcomnetedugovbizvinnicazhitomirternopilpoltavakropyvnytskyizaporizhzhiasevastopolsebastopoluzhgoroduzhhorodkharkovkharkivvinnytsiakhmelnytskyizaporizhzhecrimeaodessazhytomyrnikolaevcherkassydonetskluganskluhanskkirovogradivano-frankivskchernivtsikrymkievkyivlvivsumyzakarpattiamykolaivcherkasychernigovkhersonchernihivdnipropetrovskdnepropetrovskkhmelnitskiyneacsccogoorusorgmilcomedugovmyspreadshopadimono-ipbarsybarsyonlinelayershiftnh-servretrosnubapicampaignservicelugaffinitylotteryweeklylotteryraffleentrygluglugsmeaccoindependent-inquestnimsitecopropymntltdorgplcschnetgovnhsbarsyindependent-commissionindependent-reviewpolicepublic-inquiryindependent-panelconnhospindependent-inquiryroyal-commissionoraclegovcloudappscck12libaws-govccphxcclibpvtparochchtrcck12libcceatonk12coglibtecgendstmusann-arborwashtenawcck12glghcck12sealibforksolympiabainbridge-islkeyporthoquiamyarrow-pointcentraliaport-townsendsequimport-ludlowrentonsilverdalebremertonredmondsheltonbellevueport-orchardport-angeleskingstonchehalisaberdeengig-harborseattlepoulsboidmdndsddemenegacalamaiavawapailalflnmdcncscohnhmihiviwiriinmntnmocoutvtctmtgunjokakwvnvprarorasmskstxwynykyazisadninsnngosrvis-bymircloudservernamepointtoenscaledland-4-salefreeddnsstuff-4-saleazure-apinoipdatabricksappscloudnsgolffanheliohostazurewebsitesgvorgmilcomgubneteducoorgcomnetd0egvorgmilcomnetedugovmydnsiacostoree12orgmilcomnomwebgobbibrectecnetintedugovraremprendefirminfoartseducok12orgcomnethidnsidacaiiosonlahanamhanoicamauhueorgcompronetintedugovbizbacninhtayninhhoabinhnamdinhtravinhhaiphongvinhlonghaiduongquangnamquangtrithuathienhuequangninhbacgianghaugiangquangbinhsoctrangbentrethanhphohochiminhdanangkontumhatinhkhanhhoathanhhoahealthgialailaocaiyenbaibackanngheanlonganphuyenphuthocanthodaklakdongnainameinfovinhphucdongthapkiengiangtiengiangquangngailaichaulangsonlamdongdaknonghagiangangiangcaobangbinhduongninhthuanbinhthuanbaclieuthaibinhninhbinhbinhdinhtuyenquanghungyenbaria-vungtauthainguyendienbienbinhphuocschbizputerimagine-proxyorgcomnetedugovcloud66advisormypetsdyndnsxn--8dbq2axn--4dbgdty6cxn--5dbhl8dxn--hebda8bxn--80auxn--d1atxn--c1avgxn--o1acxn--o1achxn--90azhxn--55qx5dxn--uc0atvxn--od0algxn--wcvs22dxn--gmqw5axn--mxtq1mxn--12c1fe0brxn--h3cuzk1dixn--12co0c3b4evaxn--12cfi8ixb8lxn--o3cyx2axn--m3ch0j3axn--j1adpxn--90amcxn--90a1afxn--h1ahnxn--j1ael8bxn--h1alizxn--c1avgxn--j1aefxn--80aaa0cvacxn--41acaffeineexeopentunnelbotdashtelebitorgtmaccoagricorgmilnomwebnicngonetaltedugovlawnisschoolgrondaraccoorgmilcomschnetedugovbizinfoprg1-zeropstritonstackitlimazeropsaccoorgmilgov\u044F\u0441\u043F\u0431\u043E\u0440\u0433\u043A\u043E\u043C\u043C\u0441\u043A\u0431\u0438\u0437\u043C\u0438\u0440\u0441\u0430\u043C\u0430\u0440\u0430\u043A\u0440\u044B\u043C\u0441\u043E\u0447\u0438\u0430\u043A\u043E\u0434\u043F\u0440\u043E\u0440\u0433\u043E\u0431\u0440\u0443\u043F\u0440\u05E6\u05D4\u05DC\u05DE\u05DE\u05E9\u05DC\u05D9\u05E9\u05D5\u05D1\u05D0\u05E7\u05D3\u05DE\u05D9\u05D4\u0E2D\u0E07\u0E04\u0E4C\u0E01\u0E23\u0E18\u0E38\u0E23\u0E01\u0E34\u0E08\u0E23\u0E31\u0E10\u0E1A\u0E32\u0E25\u0E28\u0E36\u0E01\u0E29\u0E32\u0E17\u0E2B\u0E32\u0E23\u0E40\u0E19\u0E47\u0E15\u6559\u80B2\u7DB2\u7D61\u7D44\u7E54\u516C\u53F8\u653F\u5E9C\u500B\u4EBA\uB2F7\uB137\uD55C\uAD6D\u6FB3\u95E8\u65B0\u95FB\u6FB3\u9580\u8054\u901A\u5BB6\u96FB\u5609\u91CC\u62DB\u8058\u901A\u8CA9\uB2F7\uCEF4\uC0BC\uC131\u30B3\u30E0\u10D2\u10D4\u0431\u0433\u0440\u0444\u0435\u044Eadcdbdgdidmdsdtdaebedeeegeiejekemenepereseveyegabacalamanauavapaqasazacfbfafgfnfpfwftfbgcgagggegkgngmgsgpgvgtgugilmlnlalclglplsltlhmimjmkmmmomambmcmdmfmgmzmpmsmtmgbbblbsbecccacnclcmcvctcscmhkhghchbhthphshlinikifigiaibicivisikninhnmncnbngnsnpnvntnjoionomobocoaofodorosotoptstttytatbtetgtithtmtltrusuvuaucueuguhulumunufjdjbjtjsjlkmkhkfkdkcktkukskpkgpmpnpkpjpgqaqmqiqsvtvcvbvmvlvrwpwtwzwbwcwawgwkwmwtrsrprgrfrercrbrarnrmrlrkrirhrwsusrssspsgsesbsaslsmsissxmxaxcxuypysylymykygybycyuztzsznzmzkzdzczbzaz\u03B5\u03BB\u03B5\u03C5\u4E16\u754C\u53F0\u7063\u8D2D\u7269\u516C\u76CA\u70B9\u770B\u81FA\u7063\u7F51\u7EDC\u66F8\u7C4D\u5728\u7EBF\u7F51\u7AD9\u624B\u673A\u673A\u6784\u5927\u62FF\u6E38\u620F\u4FE1\u606F\u53F0\u6E7E\u8C37\u6B4C\u6148\u5584\u5546\u6807\u9999\u6E2F\u4E2D\u56FD\u9910\u5385\u7F51\u5740\u4E2D\u570B\u5546\u57CE\u98DF\u54C1\u5FAE\u535A\u653F\u52A1\u79FB\u52A8\u96C6\u56E2\u516C\u53F8\u516B\u5366\u5546\u5E97\u5065\u5EB7\u7F51\u5E97\u653F\u5E9C\u65F6\u5C1A\u4F5B\u5C71\u4E2D\u4FE1\u5A31\u4E50\u5E7F\u4E1C\u4F01\u4E1Ahomedepotengineering\u0627\u0645\u0627\u0631\u0627\u062Arepublicankuokgroupversicherungchannelcitadelxn--pgbs0dhxn--b4w605ferdstatebankwebsitexn--mgb9awbf\u4E9A\u9A6C\u900A\u6DE1\u9A6C\u9521alibabaxn--ngbc5azdxn--mgbbh1axn--45br5cyltoshibabuildworldcloudtradeguideplacespacedancemoviephoneprimesmilebiblestyleappleazurestoreskypegripexn--l1accdrivelottehorsehouseleasechasereisestadahondaomegaaetnaamicaninjanokiamediadeltavodkaedekaosakapizzaslingemailgmailtirolshelltmallfinallegaltotalhotelamfamforumrehabmusicciticricohcoachwatchboschearthfaithirishmiamiarchidubaiguccipraxi\u307F\u3093\u306A\u30B9\u30C8\u30A2\u30BB\u30FC\u30EBcanonsalononionnikonepsonkoelngreensevencrownikanoradioaudioweiboglobopromogalloyahoociscorodeovideomangobingotokyovolvolottokyotophotosmartsportquesttrusthyattjetztadultcymrubaidutushuxn--kprw13dubankclickblackmerckgroupsharpcheapnowtvxn--h2brj9c\u05E7\u05D5\u05DD\u0570\u0561\u0575\u043E\u0440\u0433\u0441\u0440\u0431\u043C\u043E\u043D\u043A\u043E\u043C\u0431\u0435\u043B\u043C\u043A\u0434\u049B\u0430\u0437\u0440\u0443\u0441\u0443\u043A\u0440\u0645\u0635\u0631\u0642\u0637\u0631\u0639\u0631\u0628\u0643\u0648\u0645dadcfdmedwedredphdthdbidpidkrdmsdltdiceonewmeglemoerwecfageacbanbambaaaammakianraspacpaaxawtfbcgaegongingaigvigorgdogdhlmilrilonlaolloluoljllcalgalnflafltelsrlfrllplkimibmcamcombommomifmabbjcbscbwebcabnabtabmlbpubabcbbcnecincpncllcstcwtcpwcnyckfhbzhovhmoiskiobisbitcifyituipinvinwinxincbnbcnmanfangdnmenrenkpnmtnyunrunfununobiojioriohbogmofooboooooacoecoceongoproartistottnttbbtcateatlatvetpetbetnethktmitfitintjothotgotdotbotprueduicujnjyouinknhktdkappsapgapmapdnptopgopllpjmpzipvipripesqtrvdtvitvdevmovgovhivnrwlawsewnewbmwwownowhowdvrftrmtrsfrbarcartvscrseusawsupsubssbsadsddsldssasbmsmlsxxxboxfoxgmxtjxsextaxbuyflydiysoyjoyskypaydaygayxyzanzbizwebersenerpokerlameractortatarsolar\u0EA5\u0EB2\u0EA7\u0E04\u0E2D\u0E21\u0E44\u0E17\u0E22tourslocusnexuslexusgiftsbeatsboatspartspressglassswiss\u0915\u0949\u092E\u0928\u0947\u091Ftiresgivescodeshomesgamestunesshoescardswalesloansvegastoolsdealsautosparis\u30D5\u30A1\u30C3\u30B7\u30E7\u30F3workssucksrocksxeroxforexfedexpartylillymoneystudyrugbytoraytoday\u4E2D\u6587\u7F51xn--unup4y\u5929\u4E3B\u6559\u98DE\u5229\u6D66\u65B0\u52A0\u5761enterprises\u6211\u7231\u4F60\u5609\u91CC\u5927\u9152\u5E97christmasxn--fct429kholdingsxn--8y0a063axn--mgbx4cd0ablifestyleabogadoallstatenetbank\u0643\u0627\u062B\u0648\u0644\u064A\u0643xn--s9brj9cxn--gk3at1ebestbuycharityxn--55qx5dmicrosoftpropertybasketballhomegoodscorsicajewelrygallerygrocerysurgerycountrybrusselsverisignferreroxn--czr694bhdfcbankcommbanksoftbank\u067E\u0627\u0643\u0633\u062A\u0627\u0646\u067E\u0627\u06A9\u0633\u062A\u0627\u0646nextdirect\u0627\u0644\u0633\u0639\u0648\u062F\u064A\u0647\u0627\u0644\u0639\u0644\u064A\u0627\u0646xn--h2brj9c8cxn--80adxhksshikshaxn--mgbai9azgqp6jcuisinellabarclayscatholicxn--kpry57dcompanyxn--xhq521bblackfridayxn--mgba3a3ejtsandvikxn--d1acj3bacademydownload\u0645\u0644\u064A\u0633\u064A\u0627xn--j1amhxn--w4r85el8fhu5dnraipirangaathletaxn--fhbeixn--mgbqly7cvafrzuerichxn--c2br7g\u0B87\u0BB2\u0B99\u0BCD\u0B95\u0BC8contractorsxn--io0a7igraphicsinsurancetemasekxn--xkc2al3hye2amotorcyclesphotographydirectoryplumbingxn--vhquvclothingtrainingcleaningwilliamhilllightingxn--mgba3a4f16ashoppingcateringeducationokinawapicturesventuresproductionsxn--9et52uwalmart\u0D2D\u0D3E\u0D30\u0D24\u0D02supportrealestatecapitalonexn--nqv7fs00emaauspostfloristdentistxn--qxamgodaddybradescobargainsmitsubishikerryhotelsxn--9dbq2axn--3pxu8kimmobilienxn--fjq720axn--mgbtx2bholidaymckinseymadridbusinessbuildershelsinkixn--4gbrim\u043C\u043E\u0441\u043A\u0432\u0430\u0627\u0644\u0633\u0639\u0648\u062F\u06CC\u0629coffeedegreelacaixapartnersalsaceofficeabbvievoyageorangegeorgeonlinechromemobilekindlegoogleoraclecircleschulesecureinsurexn--mgba7c0bbn0aestatexn--mgbc0a9azcgcruisehangoutxn--vuq861bxn--42c2d9arexrothfirestoneuniversityxn--nnx388alifeinsuranceextraspace\u043E\u043D\u043B\u0430\u0439\u043Dverm\xF6gensberatersoftwarexn--fiqs8sxn--mgbab2bdxn--w4rs40ltienda\u092D\u093E\u0930\u0924\u092E\u094Dafricatoyotaotsukasakuracameracreditcardnagoyaconsultingnetworktheatermonsterprogressivepioneerxn--55qw42gracingdatingvotingvikinglivinggivingxn--bck1b9a5dre4cbrotherweatherjoburg\u0641\u0644\u0633\u0637\u064A\u0646lplfinancialxn--clchc0ea0b2g2a9gcdfutbolschoolsocialglobaldentalwoodsidechanelairtelmatteltravelrealtorwebcamstream\u0C2D\u0C3E\u0C30\u0C24\u0C4Dunicomalstomxn--nodexn--6frz82gmuseumfurniturexn--rvc1e0am3exn--mix891faccenturexn--11b4c3dismailineustardiscountquebeccomsecclinicservicesxn--y9a3aqxn--c1avgswatchchurchsearch\u0627\u0644\u0627\u0631\u062F\u0646marketingcontacthealthmonashshoujisanofitaipeiamericanexpresssuzuki\u30A2\u30DE\u30BE\u30F3\u30AF\u30E9\u30A6\u30C9\u30DD\u30A4\u30F3\u30C8bharti\u30B0\u30FC\u30B0\u30EBxn--mgberp4a5d4armemorialxn--1qqw23alondonmormoninstitutevisionbostonnortoncouponmaisonamazonvirginberlindesigndurbanolayannissananquanxihuanhitachikaufengardenreisenbayerntechnologydatsunxn--90a3aclatinocasinostudiophysioxn--ngbe9e0apharmacytattootaobaoaramcoexpertreportabbottdirectselectimamatfairwindspictettargetmarketintuittravelersinsurancecreditdupontryukyusuppliesxn--tckwebnpparibasschmidtmerckmsdyodobashirestaurantbridgestonecricketxn--fpcrj9c3dbostikbroadwayattorneylefrakemerckxn--fiq228c5hscareersfarmerswinnersflowersxn--wgbh1cguitarsxn--54b7fta0ccxn--p1acfmakeupgalluplandroverxn--kcrx77d1x4agoldpointbauhausxn--mgbayh7gpahiphopplaystationxn--mgba3a4fraxn--eckvdtc9dhyundaixn--gckr3f0fistanbulticketsmarketsflightschintaireviewsxn--3e0b707ewindowsxn--fiqz9sfinancialxn--fzys8d69uvgm\u0627\u0628\u0648\u0638\u0628\u064Adiscoverreview\u09AC\u09BE\u0982\u09B2\u09BExn--5su34j936bgsgmoscowobserverapartments\u0434\u0435\u0442\u0438\u0627\u0631\u0627\u0645\u0643\u0648\u0441\u0430\u0439\u0442eurovisionxn--i1b6b1a6a2exn--xkc2dl3a5ee0h\u062A\u0648\u0646\u0633\u0645\u0648\u0642\u0639\u0628\u0627\u0631\u062A\u0680\u0627\u0631\u062A\u0634\u0628\u0643\u0629\u0639\u0645\u0627\u0646\u0628\u064A\u062A\u0643\u0639\u0631\u0627\u0642readkredbondlandbandfundfoodprodgoldfordtubecafesafelifeggeeieeefreefagepagegugezonewinememenamegamesaleablebikenikelikecarecbreherefiresaveloveliveblueartedatesitevotecaseluxebofamodaltdaasdatiaayogasinavanashiaasiajavabbvatevavivadatazaraarpacasavisasncfprofmaifsurfgolfdvagsongbingpingwangkpmggoogblogpohlfailcooldellcalldeallidlsarlfilmteamroomfarmimdbarabclubhdfcicbchsbcgmbhrichtechfishdishcashminiernikddiaudiwikimobitaxicitikiwidesiqponskinloanakdnwienopenporncerntownimmolimoolloinfonicofidolegosaxozeroaerovivoautovotomotofastbestresthostpostnextlgbtchatseatgiftmeetdietreitmintrentgentspotscotguruitausohumenucyoubanklinkpinkdclktalksilkbookseekworkrsvpaarpjeepshopcoophelpcamppccwshowbeerstarruhrflirweirhaircarsparsjprshausplusnewstipstoysjobskidsfanspicsdocsxboxamexsexynavycitysonyarmyallybabyplaydeliverybuzzgbizlamborghiniphilips\u0DBD\u0D82\u0D9A\u0DCF\u0CAD\u0CBE\u0CB0\u0CA4fitnessexpresslanxesspfizercenterwalterlawyersoccercareerkosherbrokerlockerdealerdoctorauthorxn--mgbqly7c0a67fbcverm\xF6gensberatungjaguarxn--pssy2uxn--hxt814eflickrrepairrogersairbusxn--mgbai9a5eva00beventsyachtsxn--t60b56a\u09AD\u09BE\u09F0\u09A4\u09AD\u09BE\u09B0\u09A4\u092D\u093E\u0930\u0924\u092D\u093E\u0930\u094B\u0924viajeshermeshughesxn--j1aef\u0938\u0902\u0917\u0920\u0928villas\u0B2D\u0B3E\u0B30\u0B24claimshotels\u0AAD\u0ABE\u0AB0\u0AA4zapposphotosjuegoscondostatamotorsgratistennis\u0A2D\u0A3E\u0A30\u0A24tkmaxxtjmaxxschaeffleryandexxn--80aswgrealtysafetybeautyluxuryxn--3ds443gsupplyfamilyxn--o3cw4hhockeysydneyxn--90aenissayalipayenergycomputeragencyxn--rovu88b\u96FB\u8A0A\u76C8\u79D1xn--gecrj9cstatefarmaccountantaquarelleolayangroup\u9999\u683C\u91CC\u62C9xn--p1ai\u7EC4\u7EC7\u673A\u6784xn--1ck2e1bxn--mgbt3dhdschwarz\u0645\u0648\u0631\u064A\u062A\u0627\u0646\u064A\u0627abudhabinowruzkomatsufujitsuhospitalxn--80asehdbxn--mgbtf8flxn--j6w193gxn--yfro4i67oprudentialxn--flw351ecruisescoursesrecipesxn--e1a4cferrarixn--ses554gxn--wgbl6awatchesstaplessinglesxn--mgbcpq6gpa1axn--otu796dpropertiescreditunionxn--mgbah1a3hjkrdstockholmhisamitsu\u0627\u0644\u0633\u0639\u0648\u062F\u064A\u0629stcgroupdomainsoriginscouponsbloombergclubmedfroganslimitedxn--80aqecdr1aexposedinternationalequipmentbarclaycardxn--q7ce6axn--mgbi4ecexpprotectionassociatesconstructionxn--cck2b3bxn--45q11candroidfoundation\u05D9\u05E9\u05E8\u05D0\u05DCxn--mgbca7dzdocliniqueboutiqueengineerxn--qxa6asystemsfirmdalefashionauctionxn--nqv7finfinitirentalsreliancetradingweddingfishinghostinggentingbookingcookingxn--3hcrj9cgraingerxn--czrs0tdemocratsamsungyokohamaxn--h2breg3evexn--nyqy26alundbeckmelbournevacationssolutionsfrontierxn--vermgensberatung-pwbmanagementxn--cg4bkixn--mgb2ddeslincolnhamburgsandvikcoromantblockbusterairforcebarefootxn--4dbrk0ceinvestmentsfeedbackcommunityxn--ngbrx\u0627\u0644\u0628\u062D\u0631\u064A\u0646diamondsamsterdamhealthcareredumbrellaxn--mxtq1mxn--2scrj9cagakhanxn--mgbpl2fh\u043A\u0430\u0442\u043E\u043B\u0438\u043Acaravan\u0B9A\u0BBF\u0B99\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0BC2\u0BB0\u0BCDrichardlimortgageamericanfamilyxn--fzc2c9e2cscholarshipssaarlandxn--imr513nvlaanderensamsclubgoodyearkitchen\u0B87\u0BA8\u0BCD\u0BA4\u0BBF\u0BAF\u0BBEweatherchannelallfinanzxn--kput3i\u0627\u0644\u0633\u0639\u0648\u062F\u06CC\u06C3xn--90aisxn--efvy88h\u0627\u0644\u062C\u0632\u0627\u0626\u0631xn--mgbaam7a8hexchangejpmorganxn--tiq49xqyjfidelitysecurityxn--mk1bu44cwanggouxn--fiq64bxn--6qq986b3xlxn--mgbbh1a71exn--80ao21amarshallsxn--5tzm5gtravelerspanasoniclatrobeyoutubeaccountantsxn--rhqv96gxn--cckwcxetdanalyticsxn--ygbi2ammx\u0628\u0627\u0632\u0627\u0631\u0628\u06BE\u0627\u0631\u062A\u0633\u0648\u0631\u064A\u0629organicfresenius\u0633\u0648\u0631\u064A\u0627xn--9krt00axn--qcka1pmcxn--jlq480n2rgdeloittesciencefinancexn--jvr189mxn--30rr7yhomesensehotmailbaseballfootballleclercboehringerxn--q9jyb4cxn--mix082f\u0627\u0644\u064A\u0645\u0646\u0647\u0645\u0631\u0627\u0647politie\u0633\u0648\u062F\u0627\u0646\u0627\u064A\u0631\u0627\u0646\u0627\u06CC\u0631\u0627\u0646netflixyamaxunxn--lgbbat1ad8jcollegestoragecapetowncolognekerrypropertiesxn--mgbgu82axn--ogbpf8flxn--czru2dwhoswhociprianilasallexn--g2xx48cforsalebanamexaudiblexn--vermgensberater-ctbxn--zfr164bericssonvanguardxn--45brj9cindustriestheatremarriottxn--3bst00mcomparexn--mgberp4a5d4a87gcapitaldigital\u0627\u0644\u0645\u063A\u0631\u0628barcelonashangrilaxn--d1alfcalvinkleinwwwcitysapporokawasakinagoyasendaikobekitakyushuyokohamackjp";
    var rulesRoot = 653;
    var exceptionsRoot = 657;
    var numberOfNodes = nodeFlags.length;
    var numberOfEdges = edgeLength.length;
    var edgeOffset = new Uint32Array(numberOfEdges);
    var edgeHash = new Uint32Array(numberOfEdges);
    var wildcardEdge = new Int32Array(numberOfNodes).fill(-1);
    for (let node = 0, offset = 0; node < numberOfNodes; node += 1) {
      for (let edge = edgeStart[node]; edge < edgeStart[node + 1]; edge += 1) {
        edgeOffset[edge] = offset;
        const end = offset + edgeLength[edge];
        let hash = 5381;
        for (let i = end - 1; i >= offset; i -= 1) {
          hash = hash * 33 ^ labelText.charCodeAt(i);
        }
        edgeHash[edge] = hash >>> 0;
        if (edgeLength[edge] === 1 && labelText.charCodeAt(offset) === 42) {
          wildcardEdge[node] = edge;
        }
        offset = end;
      }
    }
    var matchNode = -1;
    var matchStart = 0;
    var matchEnd = 0;
    function labelEquals(edge, hostname, start, length) {
      if (edgeLength[edge] !== length) {
        return false;
      }
      const offset = edgeOffset[edge];
      for (let i = 0; i < length; i += 1) {
        if (labelText.charCodeAt(offset + i) !== hostname.charCodeAt(start + i)) {
          return false;
        }
      }
      return true;
    }
    function findEdge(node, hash, hostname, start, length) {
      let lo = edgeStart[node];
      let hi = edgeStart[node + 1];
      while (lo < hi) {
        const mid = lo + hi >>> 1;
        const value = edgeHash[mid];
        if (value < hash) {
          lo = mid + 1;
        } else if (value > hash) {
          hi = mid;
        } else {
          for (let e = mid; e >= lo && edgeHash[e] === hash; e -= 1) {
            if (labelEquals(e, hostname, start, length))
              return e;
          }
          for (let e = mid + 1; e < hi && edgeHash[e] === hash; e += 1) {
            if (labelEquals(e, hostname, start, length))
              return e;
          }
          return -1;
        }
      }
      return -1;
    }
    function walk(hostname, root, allowedMask) {
      let node = root;
      let end = hostname.length;
      let hash = 5381;
      matchNode = -1;
      for (let i = hostname.length - 1; i >= 0; i -= 1) {
        const code = hostname.charCodeAt(i);
        if (code === 46) {
          const start = i + 1;
          let edge2 = findEdge(node, hash >>> 0, hostname, start, end - start);
          if (edge2 === -1) {
            edge2 = wildcardEdge[node];
          }
          if (edge2 === -1) {
            return matchNode !== -1;
          }
          node = edgeChild[edge2];
          if ((nodeFlags[node] & allowedMask) !== 0) {
            matchNode = node;
            matchStart = start;
            matchEnd = end;
          }
          end = i;
          hash = 5381;
        } else {
          hash = hash * 33 ^ code;
        }
      }
      let edge = findEdge(node, hash >>> 0, hostname, 0, end);
      if (edge === -1) {
        edge = wildcardEdge[node];
      }
      if (edge !== -1) {
        node = edgeChild[edge];
        if ((nodeFlags[node] & allowedMask) !== 0) {
          matchNode = node;
          matchStart = 0;
          matchEnd = end;
        }
      }
      return matchNode !== -1;
    }
    function suffixLookup(hostname, options, out) {
      if (fastPathLookup(hostname, options, out)) {
        return;
      }
      const allowedMask = (options.allowPrivateDomains ? 2 : 0) | (options.allowIcannDomains ? 1 : 0);
      if (walk(hostname, exceptionsRoot, allowedMask)) {
        out.isIcann = (nodeFlags[matchNode] & 1) !== 0;
        out.isPrivate = (nodeFlags[matchNode] & 2) !== 0;
        out.publicSuffix = hostname.slice(matchEnd + 1);
        return;
      }
      if (walk(hostname, rulesRoot, allowedMask)) {
        out.isIcann = (nodeFlags[matchNode] & 1) !== 0;
        out.isPrivate = (nodeFlags[matchNode] & 2) !== 0;
        out.publicSuffix = hostname.slice(matchStart);
        return;
      }
      out.isIcann = false;
      out.isPrivate = false;
      const lastDot = hostname.lastIndexOf(".");
      out.publicSuffix = lastDot === -1 ? hostname : hostname.slice(lastDot + 1);
    }
    var RESULT = getEmptyResult();
    function parse(url, options) {
      return parseImpl(url, 5, suffixLookup, options, getEmptyResult());
    }
    function getHostname(url, options) {
      resetResult(RESULT);
      return parseImpl(url, 0, suffixLookup, options, RESULT).hostname;
    }
    function getPublicSuffix(url, options) {
      resetResult(RESULT);
      return parseImpl(url, 2, suffixLookup, options, RESULT).publicSuffix;
    }
    function getDomain2(url, options) {
      resetResult(RESULT);
      return parseImpl(url, 3, suffixLookup, options, RESULT).domain;
    }
    function getFullDomain(url, options) {
      resetResult(RESULT);
      const result = parseImpl(url, 3, suffixLookup, options, RESULT);
      return result.domain === null ? null : result.hostname;
    }
    function getSubdomain(url, options) {
      resetResult(RESULT);
      return parseImpl(url, 4, suffixLookup, options, RESULT).subdomain;
    }
    function getDomainWithoutSuffix(url, options) {
      resetResult(RESULT);
      return parseImpl(url, 5, suffixLookup, options, RESULT).domainWithoutSuffix;
    }
    exports.getDomain = getDomain2;
    exports.getDomainWithoutSuffix = getDomainWithoutSuffix;
    exports.getFullDomain = getFullDomain;
    exports.getHostname = getHostname;
    exports.getPublicSuffix = getPublicSuffix;
    exports.getSubdomain = getSubdomain;
    exports.parse = parse;
  }
});

// src/cli.ts
import { spawn } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

// messages/en.json
var audit = {
  title: "CRM audit",
  description: "A measured diagnosis of your HubSpot data health, read-only.",
  run: "Run the audit",
  rerun: "Run it again",
  running: "Audit in progress",
  autoStarting: "Starting your first audit\u2026",
  runningHint: "The scan walks your entire base. Allow a few minutes on a large portal. You can leave this page, the audit keeps running.",
  started: "Audit started",
  lastRun: "Last audit: {date}",
  notAnalysed: "Not analysed",
  cappedNotice: "Your base is larger than the scan limit. The figures cover the records that were scanned, so the real totals are at least this high.",
  scopeHint: "This pillar needs an extra HubSpot permission ({scope}). Reconnect HubSpot from the Integrations page to enable it.",
  footer: "Report generated on {date}. Nothing was modified in HubSpot.",
  badges: {
    readOnly: "Read-only: nothing is modified in HubSpot",
    free: "Free: no credits used"
  },
  steps: {
    connection: "Connecting to HubSpot",
    properties: "Reading your portal's fields",
    contacts: "Analysing contacts",
    companies: "Analysing companies",
    deals: "Analysing deals",
    owners: "Reading owners",
    schema: "Analysing custom fields",
    analysis: "Computing the score",
    done: "Done"
  },
  score: {
    label: "Health score",
    verdict: {
      excellent: "Healthy base. Only a few things to improve.",
      good: "Decent base, with clearly identified work to do.",
      fair: "Degraded base: several issues are already slowing your outreach.",
      poor: "Critical base: a large share of your data is unusable."
    },
    capped: "Capped at {max}: {checks}. The pillars average {mean}, but {count, plural, one {this problem alone makes} other {these problems alone make}} the base risky to use."
  },
  scanned: {
    contacts: "Contacts scanned",
    companies: "Companies",
    deals: "Deals"
  },
  checkNotes: {
    estimate: "An estimate, not a count: derived from a {rate}% annual turnover rate.",
    sampled: "Measured on a sample of {size} contacts.",
    ghost: "At least {min} marketing emails received, not a single open or click. Apple Mail's automatic opens can only push this number down.",
    marketingWaste: "{hardBounced} hard-bounced, {optedOut} unsubscribed, {ghost} who never open (at least {min} emails received). HubSpot does not let an app set them to non-marketing: that is done in HubSpot.",
    unscored: "Outside the score for now: tracked from this audit, with no effect on the grade."
  },
  evidence: {
    show: "{count, plural, one {See the example} other {See # examples}}",
    duplicateOf: "duplicate of",
    instead: "instead of",
    monthsAgo: "months without activity",
    days: "days",
    filled: "filled on",
    missing: {
      domain: "no domain",
      industry: "no industry",
      headcount: "no headcount",
      owner: "no active owner",
      activity: "no contact from the team",
      noContact: "no contact",
      oneContact: "a single contact"
    }
  },
  skipped: {
    missing_scope: "Permission missing",
    missing_property: "Field not in this portal",
    no_data: "No data"
  },
  empty: {
    title: "No audit yet",
    description: "The audit walks your entire HubSpot portal read-only and returns a measured diagnosis of your data health.",
    bullets: {
      duplicates: "How many duplicates are sitting in your base",
      completeness: "Which essential fields are empty, and on what share",
      staleness: "How many contacts have likely changed employer",
      pipeline: "Which deals are distorting your forecast"
    }
  },
  emptyPortal: {
    title: "Empty portal",
    description: "Your HubSpot portal has no contacts or companies to analyse. Import your data, then run the audit again."
  },
  notConnected: {
    title: "Connect HubSpot to run the audit",
    description: "The audit reads your contacts, companies and deals. Nothing is modified.",
    cta: "Connect HubSpot"
  },
  failed: {
    title: "The audit did not complete",
    description: "Run it again. If it keeps failing, check that the HubSpot connection is still active on the Integrations page."
  },
  errors: {
    noWorkspace: "Workspace not found.",
    notConnected: "Connect your HubSpot account first.",
    alreadyRunning: "An audit is already running.",
    dispatch: "Could not start the audit. Try again in a moment.",
    adminRequired: "A workspace administrator must perform this action."
  },
  pillars: {
    duplicates: {
      name: "Duplicates",
      description: "Duplicate records across your contacts and companies."
    },
    completeness: {
      name: "Completeness",
      description: "Essential fields left empty on your records."
    },
    staleness: {
      name: "Staleness",
      description: "Contacts whose role or employer is probably out of date."
    },
    quality: {
      name: "Quality & format",
      description: "Data that is there, but unusable or inconsistent."
    },
    structure: {
      name: "Structure",
      description: "Records linked to nothing, or with no active owner."
    },
    freshness: {
      name: "Freshness",
      description: "Records never worked, or dormant for a long time."
    },
    deliverability: {
      name: "Deliverability",
      description: "Addresses that already failed or opted out."
    },
    pipeline: {
      name: "Pipeline",
      description: "Open deals that distort your forecast."
    },
    schemaDebt: {
      name: "Field debt",
      description: "Custom fields never filled in, or redundant."
    }
  },
  checks: {
    duplicates: {
      contacts: "Duplicate contacts",
      companies: "Duplicate companies"
    },
    completeness: {
      contact: {
        email: "Contacts with no email",
        name: "Contacts with no first name",
        lastname: "Contacts with no last name",
        phone: "Contacts with no phone number",
        linkedin: "Contacts with no LinkedIn URL",
        jobtitle: "Contacts with no job title",
        company: "Contacts with no company"
      },
      company: {
        domain: "Companies with no domain",
        name: "Companies with no name",
        industry: "Companies with no industry",
        size: "Companies with no headcount",
        location: "Companies with no location",
        linkedin: "Companies with no LinkedIn page"
      }
    },
    quality: {
      email: {
        invalid: "Structurally invalid emails",
        typo: "Emails with a misspelled domain",
        role: "Role addresses (contact@, info@\u2026)",
        free: "Personal addresses instead of work addresses"
      },
      phone: {
        format: "Phone numbers in an unusable format"
      },
      name: {
        casing: "Names in all caps or all lowercase"
      },
      company: {
        domain: "Malformed domain names",
        placeholderName: "Companies named after a URL",
        country: "Companies with a country not normalised"
      },
      country: {
        inconsistent: "Countries spelled several different ways"
      },
      contact: {
        country: "Contacts with a country not normalised"
      }
    },
    structure: {
      contact: {
        noCompany: "Contacts linked to no company",
        noOwner: "Contacts with no owner"
      },
      company: {
        noContact: "Companies with no contact",
        noOwner: "Companies with no owner",
        singleContactCustomers: "Customer companies with one contact or none"
      },
      owner: {
        inactive: "Records owned by a deactivated user"
      }
    },
    freshness: {
      contact: {
        neverContacted: "Contacts never contacted",
        dormant: "Contacts with no activity for over a year",
        neverEdited: "Contacts imported and never edited since",
        customerWithoutDeal: "Contacts marked \u201Ccustomer\u201D with no deal",
        untreatedLeads: "Untreated inbound leads (7 to 90 days)"
      }
    },
    staleness: {
      contact: {
        likelyObsolete: "Contacts whose role has likely changed",
        atRisk: "Contacts with no activity for over 2 years"
      }
    },
    deliverability: {
      hardBounce: "Contacts that hard bounced",
      optout: "Unsubscribed contacts",
      unreachable: "Contacts with no valid way to reach them",
      ghost: "Contacts who never open your marketing emails",
      marketingWaste: "Marketing contacts you pay for but cannot reach"
    },
    pipeline: {
      deal: {
        overdue: "Open deals past their close date",
        stalled: "Open deals with no activity for 60 days",
        noAmount: "Open deals with no amount",
        noContact: "Deals with no contact attached"
      }
    },
    schemaDebt: {
      ghostProperties: "Custom fields almost never filled in",
      redundantProperties: "Custom fields that duplicate each other"
    }
  },
  headline: {
    title: "Here's what we found in your CRM",
    summary: "{contacts} contacts analysed \xB7 Health score {score}/100"
  },
  highlights: {
    outdated: {
      title: "Contacts going out of date",
      unit: "contacts whose role has likely changed",
      stale: "Untouched for 2 years or more",
      bounced: "Emails that hard bounced",
      dormant: "No activity for over a year"
    },
    missing: {
      title: "Missing contact data",
      unit: "data points to enrich",
      email: "No email",
      phone: "No phone",
      linkedin: "No LinkedIn"
    },
    quality: {
      title: "Duplicates and dead ends",
      unit: "duplicate records",
      duplicateContacts: "Duplicate contacts",
      duplicateCompanies: "Duplicate companies",
      unreachable: "Contacts with no way to reach them"
    }
  },
  priority: "You told us this was a priority",
  remedy: {
    with: "Fix with {agent}",
    none: "Measured by the audit. No agent fixes this one automatically yet."
  },
  impact: {
    title: "Revenue impact",
    description: "Computed from what the scan measured in your CRM. You can correct any value and everything recalculates.",
    measured: "Measured in your CRM",
    assumption: "Assumption, change it",
    fromYou: "From your answers at signup",
    inputs: {
      averageDeal: "Average deal (\u20AC)",
      winRate: "Close rate (%)",
      customers: "Customers in your CRM",
      headcount: "People selling",
      contactsPerDay: "Contacts touched / person / day",
      minutesPerRecord: "Minutes lost per unusable record",
      minutesPerRecordHint: "Spot, clean or enrich (editable assumption)",
      monthlyCost: "True monthly cost of one salesperson (\u20AC)",
      monthlyCostHint: "Salary + employer charges (editable assumption)",
      toggle: "Correct the values",
      headcountMeasured: "Active owners who hold records"
    },
    units: {
      hours: "{n} h",
      minutes: "{n} min"
    },
    results: {
      timeLost: "Time lost",
      timeLostUnit: "per month, total across {headcount, plural, one {# person} other {# people}}",
      timeLostCost: "{amount} per year, {perPerson} per person",
      pipelineLost: "Dormant pipeline",
      pipelineLostUnit: "per year",
      ifFixed: "If fixed today",
      ifFixedUnit: "per year"
    },
    storage: "On top of that, you pay about {amount} a year to store {unusable} unusable contacts.",
    how: {
      title: "How we calculate",
      timeLost: "{unusable} of your {total} contacts are unusable ({ratio}). Each person touches {perDay} contacts a day ({perMonth} over {days} working days), of which {deadEnds} are unusable on average. At {minutes} min to spot, clean or enrich one, that is {perPerson} per person per month, {hours} across {headcount} people. On a 151.67-hour month paid {monthlyCost} per person, that comes to {amount} a year.",
      pipelineLost: "{departed} of your {customers} customers have most likely changed employer ({rate} of the base). Re-contacting them at their new company, at a {winRate} close rate on a {deal} average deal, is {amount} of pipeline nobody is working today.",
      ifFixed: "The yearly cost of the wasted time plus the dormant pipeline. Nothing else is added: no productivity multiplier, no assumed growth.",
      timeLostReach: "{unusable} of your {total} contacts cannot be reached: no usable email and no phone ({ratio}). Each person works {perDay} contacts a day, {perMonth} over {days} working days, of which {deadEnds} are unreachable on average. At {minutes} min to spot, clean or enrich a record, that is {perPerson} per person per month, {hours} for {headcount} people. Against a 151.67-hour month paid {monthlyCost} per person, that comes to {amount} a year."
    },
    storageMarketing: "On top of that, about {amount} a year is paid to HubSpot for {unusable} of your {marketing} marketing contacts that are unusable (duplicates, bounces, unsubscribed, never opening or likely gone)."
  },
  completenessChart: {
    title: "Missing fields",
    description: "Share of records where the field is empty. The longer the bar, the more work.",
    contacts: "Contacts",
    companies: "Companies"
  },
  activityChart: {
    title: "Last activity on your contacts",
    description: "The last call, meeting, email or note logged on each contact. Past 12 months, nobody is working it anymore.",
    buckets: {
      lt3: "< 3 months",
      m3to6: "3 to 6 months",
      m6to12: "6 to 12 months",
      m12to24: "12 to 24 months",
      gt24: "> 24 months",
      never: "Never"
    },
    activeShare: "Contacts with an activity in the last 12 months: {share}"
  },
  lifecycleChart: {
    title: "Lifecycle stages",
    description: "How your contacts are spread across the funnel.",
    stages: {
      subscriber: "Subscriber",
      lead: "Lead",
      marketingqualifiedlead: "Marketing qualified",
      salesqualifiedlead: "Sales qualified",
      opportunity: "Opportunity",
      customer: "Customer",
      evangelist: "Evangelist",
      other: "Other",
      unknown: "Not set"
    }
  },
  ownership: {
    title: "Ownership and activity",
    withOwner: "Contacts with an owner",
    unassigned: "Unassigned contacts",
    withActivity: "Contacts with activity"
  },
  detail: {
    title: "Full detail, pillar by pillar",
    description: "Every number above, with the records behind it.",
    show: "See the full detail",
    hide: "Hide the detail"
  },
  health: {
    title: "CRM health",
    description: "A free, read-only diagnosis of your HubSpot data.",
    cta: "Diagnose my CRM",
    seeReport: "See the full report",
    rerun: "Run it again",
    never: "Never audited",
    running: "Audit in progress\u2026",
    contactsAnalysed: "{count} contacts analysed"
  },
  overview: {
    activable: {
      label: "Activable contacts",
      of: "of {total}",
      callable: "{count, plural, =0 {None callable} one {# callable} other {{n} callable}} (with a phone)",
      rule: "Activable: a valid email (no bounce, not unsubscribed, not inactive), associated with a company, with a job title and an owner who is still active.",
      ruleAssigned: "Activable: a valid email (no bounce, not unsubscribed, not inactive), associated with a company, with a job title and an owner. Without access to HubSpot users, we cannot tell whether that owner is still active.",
      unavailable: "Your portal does not expose contact emails, so we cannot tell which contacts are activable."
    },
    missing: {
      email: "No valid email",
      company: "No company",
      jobTitle: "No job title",
      owner: "No active owner",
      note: "A contact can miss several criteria: these numbers do not add up."
    },
    gap: {
      since: "{gap} since {date}",
      scoreSince: "{gap} {count, plural, one {point} other {points}} since {date}",
      notComparable: "The scoring method changed since the previous audit: the score is not compared."
    },
    fixed: {
      title: "Fixed by Jipup since {date}:",
      families: {
        duplicatesMerged: "{count, plural, one {# duplicate merged} other {{n} duplicates merged}}",
        emailsFound: "{count, plural, one {# email found} other {{n} emails found}}",
        mobilesFound: "{count, plural, one {# mobile found} other {{n} mobiles found}}",
        emailsVerified: "{count, plural, one {# email verified} other {{n} emails verified}}",
        jobChanges: "{count, plural, one {# job change detected} other {{n} job changes detected}}",
        contactsAssociated: "{count, plural, one {# contact associated with its company} other {{n} contacts associated with their company}}",
        contactsEnriched: "{count, plural, one {# contact record completed} other {{n} contact records completed}}",
        companiesEnriched: "{count, plural, one {# company enriched} other {{n} companies enriched}}"
      }
    },
    newContacts: {
      line: "{count, plural, =0 {No contact created in the last {days} days.} one {# contact created in the last {days} days, {pct} activable (the base: {base}).} other {{n} contacts created in the last {days} days, {pct} activable (the base: {base}).}}",
      bySource: "Activable by origin: {list}",
      sourceItem: "{source} {pct} of {n}"
    },
    createdByJipup: "Created by Jipup: {list}",
    createdContacts: "{count, plural, one {# contact} other {{n} contacts}}",
    createdCompanies: "{count, plural, one {# company} other {{n} companies}}"
  },
  problems: {
    title: "Fix first",
    description: "Ranked by records affected and severity. A customer or opportunity record counts three times.",
    none: "Nothing notable: your base is healthy on everything we measure.",
    share: {
      contact: "{n} contacts of {total} ({pct})",
      company: "{n} companies of {total} ({pct})",
      activable: "{n} contacts of {total} activable ({pct})"
    },
    segment: {
      contacts: "{count, plural, one {Including # customer or opportunity} other {Including {n} customers or opportunities}}",
      companies: "{count, plural, one {Including # customer or opportunity company} other {Including {n} customer or opportunity companies}}"
    },
    activableIfFixed: "{count, plural, one {# contact would become activable} other {{n} contacts would become activable}} once this is fixed.",
    fix: {
      agent: "Agent that fixes it",
      credits: "About {n} credits",
      creditsPerPass: "About {n} credits per pass",
      open: "Set up the agent",
      manualLabel: "To do",
      creditsAtMost: "At most {n} credits"
    },
    prompt: {
      copy: "Copy the prompt",
      copied: "Prompt copied",
      copyFailed: "Could not copy, select the text below",
      assistant: "Fix it with the assistant",
      hint: "Paste it into the Jipup assistant, or Claude or Codex connected to the Jipup MCP."
    },
    items: {
      duplicateContacts: {
        title: "Duplicate contacts",
        consequence: "The same person exists several times: split history, double follow-ups, wrong sales attribution.",
        manual: "Merge the duplicates in HubSpot, customers first."
      },
      duplicateCompanies: {
        title: "Duplicate companies",
        consequence: "One account is split across several records: contacts, deals and revenue scattered.",
        manual: "Merge the duplicate companies in HubSpot."
      },
      marketingUnreachable: {
        title: "Marketing contacts billed but unreachable",
        consequence: "Bounced, unsubscribed or never opening, they are paid to HubSpot every month and will receive no email, about {amount} a year.",
        manual: "Set them back to non-marketing contacts in HubSpot: HubSpot does not let an app make that change."
      },
      hardBounces: {
        title: "Hard-bounced email addresses",
        consequence: "Every send to these addresses fails and hurts your domain's reputation for all your other emails.",
        manual: "Verify these addresses and find the new email of the people concerned."
      },
      likelyMoved: {
        title: "Contacts with no activity for over 2 years",
        consequence: "Many have changed role or company: your teams write to people who left, and former customers who moved are never contacted.",
        manual: "Check these contacts' current role on LinkedIn."
      },
      missingEmail: {
        title: "Contacts with no email",
        consequence: "They cannot be included in a campaign or a sequence.",
        manual: "Find these contacts' professional email."
      },
      noCompany: {
        title: "Contacts associated with no company",
        consequence: "Invisible in account views, they escape account targeting and reporting.",
        manual: "Associate each contact with its company in HubSpot."
      },
      missingJobTitle: {
        title: "Contacts with no job title",
        consequence: "Decision makers cannot be targeted, nor messages tailored to the role.",
        manual: "Fill in the job title from these contacts' LinkedIn profile."
      },
      noActiveOwner: {
        title: "Contacts with no active owner",
        consequence: "No owner, or owned by someone who left the team: nobody follows them up, and tasks assigned on them will never be done.",
        manual: "Assign these contacts in HubSpot to someone in the team."
      },
      missingPhone: {
        title: "Activable contacts with no phone",
        consequence: "Reachable by email, but your sales team cannot call them.",
        manual: "Find these contacts' mobile number."
      },
      incompleteCompanies: {
        title: "Companies with no domain, industry or headcount",
        consequence: "They cannot be segmented, scored or matched to a target account.",
        manual: "Fill these companies in from their LinkedIn page."
      },
      untreatedLeads: {
        title: "Untreated inbound leads",
        consequence: "These people came in on their own (form, website, chat) 7 to 90 days ago, and nobody active owns them or nothing was done: the request goes cold, or goes to a competitor.",
        manual: "Assign these leads to an active person on the team and plan a first contact."
      },
      singleContactCustomers: {
        title: "Customer accounts with a single contact",
        consequence: "The whole relationship rests on one person, or on nobody: if they leave, the account goes silent, and you cannot expand the deal to other teams.",
        manual: "Add the other people of these accounts in HubSpot (decision makers, users, purchasing)."
      },
      unnormalizedCountries: {
        title: "Contact countries not normalised",
        consequence: "The same country is written several ways (case, code, a city or region in front): segments, filters and reports by country miss part of the contacts.",
        manual: "Replace these values with the country's name, then turn the Country property into a dropdown for what comes next."
      }
    },
    sources: "Origin: {list}"
  },
  sources: {
    import: "import",
    jipup: "Jipup",
    integration: "other integration",
    manual: "typed in HubSpot",
    api: "API",
    inbound: "inbound (form, website)",
    other: "other origin",
    unknown: "unknown origin"
  },
  sourcesAnd: " and "
};
var catalog = {
  actionTypes: {
    email_verification: "Email verification",
    email_enrichment: "Email enrichment",
    duplicate_merge: "Duplicate detection & merge",
    company_enrichment: "Company enrichment",
    contact_enrichment: "Contact enrichment",
    job_change_scan: "Job change scan",
    mobile_enrichment: "Mobile enrichment",
    lead_qualification: "Lead qualification",
    company_link: "Company link",
    legal_enrichment: "French legal enrichment",
    domain_enrichment: "Domain name",
    reverse_email_lookup: "Email reverse lookup",
    contact_linkedin_url_lookup: "Contact LinkedIn URL lookup",
    company_linkedin_url_lookup: "Company LinkedIn page lookup",
    new_hire_scan: "New hires scan",
    new_hire_delivery: "New hire",
    company_association: "Company association",
    find_people: "Contacts found"
  },
  actionHints: {
    email_enrichment: "(work email address)",
    contact_enrichment: "(job title, location, identity, language, from the LinkedIn profile)",
    company_enrichment: "(industry, headcount, website, address, description, from the LinkedIn page)",
    contact_linkedin_url_lookup: "(the profile URL, from name and company)",
    company_linkedin_url_lookup: "(the page URL, from name or domain)",
    mobile_enrichment: "(direct mobile number)",
    legal_enrichment: "(SIREN, SIRET, APE code; source INSEE / data.gouv.fr)",
    domain_enrichment: "(domain and website of records that have none, from the name, city and SIREN)"
  },
  agents: {
    duplicate_detector: {
      name: "Duplicate Detector",
      tagline: "Detects and merges duplicates",
      description: "Identifies duplicate contacts and companies, merges records automatically when confidence is high, and sends borderline cases to manual validation."
    },
    job_change_tracker: {
      name: "Job Change Tracker",
      tagline: "Tracks job changes",
      description: "Monitors job changes and creates a sales task when a qualified contact joins a new company, then associates them with the right company record."
    },
    crm_enrichment: {
      name: "CRM Enrichment Agent",
      tagline: "Enriches contacts and companies",
      description: "Completes contact and company records: email, mobile, LinkedIn, company registration number, job title, industry, headcount, website, location. You only pay for successful enrichments."
    },
    lead_qualifier: {
      name: "Lead Qualifier",
      tagline: "Qualifies and prioritises your leads",
      description: "Analyses each contact and its associated company, scores the fit against your criteria (described in plain language), writes the score onto the record and creates a sales task for qualified leads. Ideal for triaging inbound leads or reactivating a database."
    },
    reverse_email_lookup: {
      name: "Email reverse lookup",
      tagline: "Finds the person behind an email",
      description: "From the email alone (personal or professional), recovers the contact's full identity: first name, last name, company, LinkedIn URL, job title, location and language. Also creates or attaches the employer's company record (domain, headcount, industry, description\u2026). The only path for records born from a form fill, a list import or a badge scan. Billed only when the person is found and the record completed."
    },
    new_hire_tracker: {
      name: "New hire detection",
      tagline: "Spots newcomers in your target roles",
      description: "On a list of companies from your CRM, spots on every run the people who recently took the roles you target (HR director, head of sales\u2026), creates or updates their contact record and attaches it to the company. Billed per scanned company.",
      descriptionNoCreation: "On a list of companies from your CRM, spots on every run the people who recently took the roles you target (HR director, head of sales\u2026), updates the record of those already in your CRM and attaches it to the company. Billed per scanned company."
    },
    email_verification: {
      name: "Email verification",
      tagline: "Verifies emails and writes the verdict on the record",
      description: "Checks each email with BounceBan and writes on the record whether it is deliverable, risky, undeliverable or unknown, with the date and the indicators (role address, personal email, disposable, catch-all). An unknown verdict is not billed and is rechecked three days later. Billed 1 credit per verified email."
    },
    company_association: {
      name: "Associate contacts to companies",
      tagline: "Associates contacts without a company to their current employer",
      description: "Finds the current employer of contacts with no company from LinkedIn or their email, finds or creates the company in the CRM and sets it as primary. Along the way, fills the contact's empty fields (name, job title, location, language) with what it read, never overwriting anything. The association is free, only the lookups that find something are billed."
    }
  },
  plans: {
    free: {
      name: "Free",
      description: "Try Jipup for free.",
      highlights: [
        "Limited access",
        "1 agent included"
      ]
    },
    starter: {
      name: "Starter",
      description: "To start maintaining your CRM automatically.",
      highlights: [
        "10,000 credits / month",
        "3 agents included",
        "Credits roll over to the next month"
      ]
    },
    growth: {
      name: "Growth",
      description: "For sales teams that are scaling.",
      highlights: [
        "35,000 credits / month",
        "Advanced manual validation",
        "Priority support"
      ]
    },
    scale: {
      name: "Scale",
      description: "For large, multi-team CRM databases.",
      highlights: [
        "100,000 credits / month",
        "High volumes per run",
        "Global rules & SSO"
      ]
    }
  },
  frequencies: {
    weekly: "Every week",
    biweekly: "Every 2 weeks",
    triweekly: "Every 3 weeks",
    monthly: "Every month"
  },
  enrichmentFields: {
    email: "Email",
    mobile_phone: "Mobile phone",
    linkedin_url: "LinkedIn URL",
    siren_siret: "Company reg. number",
    job_title: "Job title",
    industry: "Industry",
    headcount: "Headcount",
    website: "Website",
    location: "Location",
    description: "Description"
  },
  objects: {
    contact: "Contacts",
    company: "Companies",
    both: "Contacts and companies"
  },
  agentNames: {
    duplicate_detector: "Duplicate Detection",
    job_change_tracker: "Job Change Tracking",
    crm_enrichment_contact: "Contact Enrichment",
    crm_enrichment_company: "Company Enrichment",
    lead_qualifier: "Lead Qualification",
    reverse_email_lookup: "Email reverse lookup",
    new_hire_tracker: "New hire detection",
    email_verification: "Email verification",
    company_association: "Associate contacts to companies"
  },
  copySuffix: "(copy)"
};

// messages/fr.json
var audit2 = {
  title: "Audit de votre CRM",
  description: "Un diagnostic chiffr\xE9 de la sant\xE9 de vos donn\xE9es HubSpot, en lecture seule.",
  run: "Lancer l'audit",
  rerun: "Relancer l'audit",
  running: "Audit en cours",
  autoStarting: "Lancement de votre premier audit\u2026",
  runningHint: "L'analyse parcourt l'int\xE9gralit\xE9 de votre base. Comptez quelques minutes sur un gros portail. Vous pouvez quitter cette page, l'audit continue.",
  started: "Audit lanc\xE9",
  lastRun: "Dernier audit : {date}",
  notAnalysed: "Non analys\xE9",
  cappedNotice: "Votre base d\xE9passe la limite d'analyse. Les chiffres portent sur les fiches parcourues : les totaux r\xE9els sont donc au moins aussi \xE9lev\xE9s.",
  scopeHint: "Ce pilier n\xE9cessite une autorisation HubSpot suppl\xE9mentaire ({scope}). Reconnectez HubSpot depuis la page Int\xE9grations pour l'activer.",
  footer: "Rapport g\xE9n\xE9r\xE9 le {date}. Aucune donn\xE9e n'a \xE9t\xE9 modifi\xE9e dans HubSpot.",
  badges: {
    readOnly: "Lecture seule : rien n'est modifi\xE9 dans HubSpot",
    free: "Gratuit : aucun cr\xE9dit consomm\xE9"
  },
  steps: {
    connection: "Connexion \xE0 HubSpot",
    properties: "Lecture des champs de votre portail",
    contacts: "Analyse des contacts",
    companies: "Analyse des entreprises",
    deals: "Analyse des transactions",
    owners: "Lecture des propri\xE9taires",
    schema: "Analyse des champs personnalis\xE9s",
    analysis: "Calcul du score",
    done: "Termin\xE9"
  },
  score: {
    label: "Score de sant\xE9",
    verdict: {
      excellent: "Base saine. Quelques points d'am\xE9lioration seulement.",
      good: "Base correcte, avec des chantiers clairement identifi\xE9s.",
      fair: "Base d\xE9grad\xE9e : plusieurs points freinent d\xE9j\xE0 votre prospection.",
      poor: "Base critique : une part importante de vos donn\xE9es est inexploitable."
    },
    capped: "Plafonn\xE9 \xE0 {max} : {checks}. La moyenne des piliers est de {mean}, mais {count, plural, one {ce probl\xE8me suffit} other {ces probl\xE8mes suffisent}} \xE0 rendre la base risqu\xE9e \xE0 utiliser."
  },
  scanned: {
    contacts: "Contacts analys\xE9s",
    companies: "Entreprises",
    deals: "Transactions"
  },
  checkNotes: {
    estimate: "Estimation, et non un d\xE9compte : calcul\xE9e \xE0 partir d'un taux de rotation de {rate} % par an.",
    sampled: "Mesur\xE9 sur un \xE9chantillon de {size} contacts.",
    ghost: "Au moins {min} emails marketing re\xE7us, aucune ouverture ni aucun clic. Les ouvertures automatiques d'Apple Mail ne peuvent que faire baisser ce chiffre.",
    marketingWaste: "{hardBounced} en bounce d\xE9finitif, {optedOut} d\xE9sinscrits, {ghost} qui n'ouvrent jamais (au moins {min} emails re\xE7us). HubSpot ne permet pas de les repasser en non-marketing par l'API : c'est \xE0 faire dans HubSpot.",
    unscored: "Hors score pour l'instant : suivi depuis cet audit, sans effet sur la note."
  },
  evidence: {
    show: "{count, plural, one {Voir l'exemple} other {Voir # exemples}}",
    duplicateOf: "doublon de",
    instead: "au lieu de",
    monthsAgo: "mois sans activit\xE9",
    days: "jours",
    filled: "rempli sur",
    missing: {
      domain: "sans domaine",
      industry: "sans secteur",
      headcount: "sans effectif",
      owner: "sans propri\xE9taire actif",
      activity: "aucun contact de l'\xE9quipe",
      noContact: "aucun contact",
      oneContact: "un seul contact"
    }
  },
  skipped: {
    missing_scope: "Autorisation manquante",
    missing_property: "Champ absent du portail",
    no_data: "Aucune donn\xE9e"
  },
  empty: {
    title: "Aucun audit pour l'instant",
    description: "L'audit parcourt l'int\xE9gralit\xE9 de votre portail HubSpot en lecture seule et vous rend un diagnostic chiffr\xE9 de la sant\xE9 de vos donn\xE9es.",
    bullets: {
      duplicates: "Combien de doublons dorment dans votre base",
      completeness: "Quels champs essentiels sont vides, et sur quelle proportion",
      staleness: "Combien de contacts ont probablement chang\xE9 d'entreprise",
      pipeline: "Quelles transactions faussent votre pr\xE9visionnel"
    }
  },
  emptyPortal: {
    title: "Portail vide",
    description: "Votre portail HubSpot ne contient aucun contact ni aucune entreprise \xE0 analyser. Importez vos donn\xE9es, puis relancez l'audit."
  },
  notConnected: {
    title: "Connectez HubSpot pour lancer l'audit",
    description: "L'audit lit vos contacts, vos entreprises et vos transactions. Aucune donn\xE9e n'est modifi\xE9e.",
    cta: "Connecter HubSpot"
  },
  failed: {
    title: "L'audit n'a pas abouti",
    description: "Relancez-le. Si le probl\xE8me persiste, v\xE9rifiez que la connexion HubSpot est toujours active sur la page Int\xE9grations."
  },
  errors: {
    noWorkspace: "Espace de travail introuvable.",
    notConnected: "Connectez d'abord votre compte HubSpot.",
    alreadyRunning: "Un audit est d\xE9j\xE0 en cours.",
    dispatch: "Impossible de lancer l'audit. R\xE9essayez dans un instant.",
    adminRequired: "Un administrateur de cet espace doit effectuer cette action."
  },
  pillars: {
    duplicates: {
      name: "Doublons",
      description: "Fiches en double parmi vos contacts et vos entreprises."
    },
    completeness: {
      name: "Compl\xE9tude",
      description: "Champs essentiels laiss\xE9s vides sur vos fiches."
    },
    staleness: {
      name: "Obsolescence",
      description: "Contacts dont le poste ou l'entreprise n'est probablement plus \xE0 jour."
    },
    quality: {
      name: "Qualit\xE9 et format",
      description: "Donn\xE9es pr\xE9sentes, mais inutilisables ou incoh\xE9rentes."
    },
    structure: {
      name: "Structure",
      description: "Fiches rattach\xE9es \xE0 rien, ou sans propri\xE9taire actif."
    },
    freshness: {
      name: "Fra\xEEcheur",
      description: "Fiches jamais travaill\xE9es ou dormantes depuis longtemps."
    },
    deliverability: {
      name: "D\xE9livrabilit\xE9",
      description: "Adresses qui ont d\xE9j\xE0 \xE9chou\xE9 ou qui se sont d\xE9sinscrites."
    },
    pipeline: {
      name: "Pipeline",
      description: "Transactions ouvertes qui faussent votre pr\xE9visionnel."
    },
    schemaDebt: {
      name: "Dette de champs",
      description: "Champs personnalis\xE9s jamais remplis ou redondants."
    }
  },
  checks: {
    duplicates: {
      contacts: "Contacts en doublon",
      companies: "Entreprises en doublon"
    },
    completeness: {
      contact: {
        email: "Contacts sans email",
        name: "Contacts sans pr\xE9nom",
        lastname: "Contacts sans nom",
        phone: "Contacts sans t\xE9l\xE9phone",
        linkedin: "Contacts sans URL LinkedIn",
        jobtitle: "Contacts sans intitul\xE9 de poste",
        company: "Contacts sans entreprise renseign\xE9e"
      },
      company: {
        domain: "Entreprises sans nom de domaine",
        name: "Entreprises sans nom",
        industry: "Entreprises sans secteur",
        size: "Entreprises sans effectif",
        location: "Entreprises sans localisation",
        linkedin: "Entreprises sans page LinkedIn"
      }
    },
    quality: {
      email: {
        invalid: "Emails structurellement invalides",
        typo: "Emails avec une faute dans le domaine",
        role: "Adresses g\xE9n\xE9riques (contact@, info@\u2026)",
        free: "Adresses personnelles au lieu d'une adresse pro"
      },
      phone: {
        format: "T\xE9l\xE9phones au format inexploitable"
      },
      name: {
        casing: "Noms tout en majuscules ou tout en minuscules"
      },
      company: {
        domain: "Noms de domaine mal saisis",
        placeholderName: "Entreprises nomm\xE9es par une URL",
        country: "Soci\xE9t\xE9s au pays non normalis\xE9"
      },
      country: {
        inconsistent: "Pays \xE9crits de plusieurs fa\xE7ons diff\xE9rentes"
      },
      contact: {
        country: "Contacts au pays non normalis\xE9"
      }
    },
    structure: {
      contact: {
        noCompany: "Contacts rattach\xE9s \xE0 aucune entreprise",
        noOwner: "Contacts sans propri\xE9taire"
      },
      company: {
        noContact: "Entreprises sans aucun contact",
        noOwner: "Entreprises sans propri\xE9taire",
        singleContactCustomers: "Soci\xE9t\xE9s clientes avec un seul contact ou aucun"
      },
      owner: {
        inactive: "Fiches d\xE9tenues par un utilisateur d\xE9sactiv\xE9"
      }
    },
    freshness: {
      contact: {
        neverContacted: "Contacts jamais contact\xE9s",
        dormant: "Contacts sans activit\xE9 depuis plus d'un an",
        neverEdited: "Contacts import\xE9s et jamais modifi\xE9s depuis",
        customerWithoutDeal: "Contacts \xAB client \xBB sans aucune transaction",
        untreatedLeads: "Leads entrants non trait\xE9s (7 \xE0 90 jours)"
      }
    },
    staleness: {
      contact: {
        likelyObsolete: "Contacts dont le poste a probablement chang\xE9",
        atRisk: "Contacts sans activit\xE9 depuis plus de 2 ans"
      }
    },
    deliverability: {
      hardBounce: "Contacts en erreur d'envoi d\xE9finitive",
      optout: "Contacts d\xE9sinscrits",
      unreachable: "Contacts sans aucun moyen de contact valide",
      ghost: "Contacts qui n'ouvrent jamais vos emails marketing",
      marketingWaste: "Contacts marketing factur\xE9s mais injoignables"
    },
    pipeline: {
      deal: {
        overdue: "Transactions ouvertes dont la date de cl\xF4ture est d\xE9pass\xE9e",
        stalled: "Transactions ouvertes sans activit\xE9 depuis 60 jours",
        noAmount: "Transactions ouvertes sans montant",
        noContact: "Transactions sans aucun contact rattach\xE9"
      }
    },
    schemaDebt: {
      ghostProperties: "Champs personnalis\xE9s quasiment jamais remplis",
      redundantProperties: "Champs personnalis\xE9s qui font doublon"
    }
  },
  headline: {
    title: "Voici ce que nous avons trouv\xE9 dans votre CRM",
    summary: "{contacts} contacts analys\xE9s \xB7 Score de sant\xE9 {score}/100"
  },
  highlights: {
    outdated: {
      title: "Contacts en train de p\xE9rimer",
      unit: "contacts dont le poste a probablement chang\xE9",
      stale: "Sans mise \xE0 jour depuis 2 ans ou plus",
      bounced: "Emails qui ont rebondi d\xE9finitivement",
      dormant: "Sans activit\xE9 depuis plus d'un an"
    },
    missing: {
      title: "Donn\xE9es de contact manquantes",
      unit: "donn\xE9es \xE0 enrichir",
      email: "Sans email",
      phone: "Sans t\xE9l\xE9phone",
      linkedin: "Sans LinkedIn"
    },
    quality: {
      title: "Doublons et impasses",
      unit: "fiches en doublon",
      duplicateContacts: "Contacts en doublon",
      duplicateCompanies: "Entreprises en doublon",
      unreachable: "Contacts injoignables"
    }
  },
  priority: "Vous nous avez dit que c'\xE9tait une priorit\xE9",
  remedy: {
    with: "Corriger avec {agent}",
    none: "Mesur\xE9 par l'audit. Aucun agent ne corrige encore ce point automatiquement."
  },
  impact: {
    title: "Impact sur votre chiffre d'affaires",
    description: "Calcul\xE9 avec ce que le scan a mesur\xE9 dans votre CRM. Vous pouvez corriger chaque valeur, tout se recalcule.",
    measured: "Mesur\xE9 dans votre CRM",
    assumption: "Hypoth\xE8se modifiable",
    fromYou: "D'apr\xE8s vos r\xE9ponses \xE0 l'inscription",
    inputs: {
      averageDeal: "Panier moyen (\u20AC)",
      winRate: "Taux de closing (%)",
      customers: "Clients dans votre CRM",
      headcount: "Personnes qui vendent",
      contactsPerDay: "Contacts trait\xE9s / personne / jour",
      minutesPerRecord: "Minutes perdues par fiche inutilisable",
      minutesPerRecordHint: "Rep\xE9rer, nettoyer ou enrichir (hypoth\xE8se modifiable)",
      monthlyCost: "Co\xFBt r\xE9el d'un commercial par mois (\u20AC)",
      monthlyCostHint: "Salaire + charges (hypoth\xE8se modifiable)",
      toggle: "Corriger les valeurs",
      headcountMeasured: "Propri\xE9taires actifs qui d\xE9tiennent des fiches"
    },
    units: {
      hours: "{n} h",
      minutes: "{n} min"
    },
    results: {
      timeLost: "Temps perdu",
      timeLostUnit: "par mois, au total pour {headcount, plural, one {# personne} other {# personnes}}",
      timeLostCost: "{amount} par an, soit {perPerson} par personne",
      pipelineLost: "Pipeline dormant",
      pipelineLostUnit: "par an",
      ifFixed: "Si corrig\xE9 aujourd'hui",
      ifFixedUnit: "par an"
    },
    storage: "S'y ajoutent environ {amount} par an pay\xE9s pour stocker {unusable} contacts inutilisables.",
    how: {
      title: "Comment nous calculons",
      timeLost: "{unusable} de vos {total} contacts sont inutilisables ({ratio}). Chaque personne traite {perDay} contacts par jour, soit {perMonth} sur {days} jours ouvr\xE9s, dont {deadEnds} inutilisables en moyenne. \xC0 {minutes} min pour rep\xE9rer, nettoyer ou enrichir une fiche, cela fait {perPerson} par personne et par mois, soit {hours} pour {headcount} personnes. Rapport\xE9 \xE0 un mois de 151,67 heures pay\xE9 {monthlyCost} par personne, cela repr\xE9sente {amount} par an.",
      pipelineLost: "{departed} de vos {customers} clients ont tr\xE8s probablement chang\xE9 d'employeur ({rate} de la base). Les recontacter dans leur nouvelle entreprise, \xE0 {winRate} de taux de closing sur un panier moyen de {deal}, repr\xE9sente {amount} de pipeline que personne ne travaille aujourd'hui.",
      ifFixed: "Le co\xFBt annuel du temps perdu, plus le pipeline dormant. Rien d'autre n'est ajout\xE9 : ni multiplicateur de productivit\xE9, ni croissance suppos\xE9e.",
      timeLostReach: "{unusable} de vos {total} contacts sont injoignables : ni email utilisable, ni t\xE9l\xE9phone ({ratio}). Chaque personne traite {perDay} contacts par jour, soit {perMonth} sur {days} jours ouvr\xE9s, dont {deadEnds} injoignables en moyenne. \xC0 {minutes} min pour rep\xE9rer, nettoyer ou enrichir une fiche, cela fait {perPerson} par personne et par mois, soit {hours} pour {headcount} personnes. Rapport\xE9 \xE0 un mois de 151,67 heures pay\xE9 {monthlyCost} par personne, cela repr\xE9sente {amount} par an."
    },
    storageMarketing: "S'y ajoutent environ {amount} par an pay\xE9s \xE0 HubSpot pour {unusable} de vos {marketing} contacts marketing, inutilisables (doublons, bounces, d\xE9sinscrits, inactifs ou probablement partis)."
  },
  completenessChart: {
    title: "Champs manquants",
    description: "Part des fiches o\xF9 le champ est vide. Plus la barre est longue, plus il y a de travail.",
    contacts: "Contacts",
    companies: "Entreprises"
  },
  activityChart: {
    title: "Derni\xE8re activit\xE9 sur vos contacts",
    description: "Dernier appel, r\xE9union, email ou note enregistr\xE9 sur chaque contact. Au-del\xE0 de 12 mois, plus personne ne le travaille.",
    buckets: {
      lt3: "< 3 mois",
      m3to6: "3 \xE0 6 mois",
      m6to12: "6 \xE0 12 mois",
      m12to24: "12 \xE0 24 mois",
      gt24: "> 24 mois",
      never: "Jamais"
    },
    activeShare: "Contacts avec une activit\xE9 ces 12 derniers mois : {share}"
  },
  lifecycleChart: {
    title: "\xC9tapes du cycle de vie",
    description: "R\xE9partition de vos contacts dans l'entonnoir.",
    stages: {
      subscriber: "Abonn\xE9",
      lead: "Lead",
      marketingqualifiedlead: "Qualifi\xE9 marketing",
      salesqualifiedlead: "Qualifi\xE9 commercial",
      opportunity: "Opportunit\xE9",
      customer: "Client",
      evangelist: "Ambassadeur",
      other: "Autre",
      unknown: "Non renseign\xE9"
    }
  },
  ownership: {
    title: "Propri\xE9t\xE9 et activit\xE9",
    withOwner: "Contacts avec un propri\xE9taire",
    unassigned: "Contacts sans propri\xE9taire",
    withActivity: "Contacts avec activit\xE9"
  },
  detail: {
    title: "Le d\xE9tail complet, pilier par pilier",
    description: "Chaque chiffre ci-dessus, avec les fiches qui le prouvent.",
    show: "Voir le d\xE9tail complet",
    hide: "Masquer le d\xE9tail"
  },
  health: {
    title: "Sant\xE9 de votre CRM",
    description: "Un diagnostic gratuit et en lecture seule de vos donn\xE9es HubSpot.",
    cta: "Diagnostiquer mon CRM",
    seeReport: "Voir le rapport complet",
    rerun: "Relancer l'audit",
    never: "Jamais audit\xE9",
    running: "Audit en cours\u2026",
    contactsAnalysed: "{count} contacts analys\xE9s"
  },
  overview: {
    activable: {
      label: "Contacts activables",
      of: "sur {total}",
      callable: "{count, plural, =0 {Aucun appelable} one {dont # appelable} other {dont {n} appelables}} (avec un t\xE9l\xE9phone)",
      rule: "Activable : email valide (ni bounce, ni d\xE9sinscrit, ni inactif), rattach\xE9 \xE0 une soci\xE9t\xE9, avec un poste et un propri\xE9taire toujours actif.",
      ruleAssigned: "Activable : email valide (ni bounce, ni d\xE9sinscrit, ni inactif), rattach\xE9 \xE0 une soci\xE9t\xE9, avec un poste et un propri\xE9taire. Sans acc\xE8s aux utilisateurs HubSpot, nous ne savons pas si ce propri\xE9taire est encore actif.",
      unavailable: "Votre portail n'expose pas l'email des contacts : impossible de dire lesquels sont activables."
    },
    missing: {
      email: "Sans email valide",
      company: "Sans soci\xE9t\xE9",
      jobTitle: "Sans poste",
      owner: "Sans propri\xE9taire actif",
      note: "Un contact peut manquer de plusieurs crit\xE8res : ces nombres ne s'additionnent pas."
    },
    gap: {
      since: "{gap} depuis le {date}",
      scoreSince: "{gap} {count, plural, one {point} other {points}} depuis le {date}",
      notComparable: "La m\xE9thode de calcul a chang\xE9 depuis l'audit pr\xE9c\xE9dent : le score n'est pas compar\xE9."
    },
    fixed: {
      title: "Corrig\xE9 par Jipup depuis le {date} :",
      families: {
        duplicatesMerged: "{count, plural, one {# doublon fusionn\xE9} other {{n} doublons fusionn\xE9s}}",
        emailsFound: "{count, plural, one {# email trouv\xE9} other {{n} emails trouv\xE9s}}",
        mobilesFound: "{count, plural, one {# mobile trouv\xE9} other {{n} mobiles trouv\xE9s}}",
        emailsVerified: "{count, plural, one {# email v\xE9rifi\xE9} other {{n} emails v\xE9rifi\xE9s}}",
        jobChanges: "{count, plural, one {# changement de poste d\xE9tect\xE9} other {{n} changements de poste d\xE9tect\xE9s}}",
        contactsAssociated: "{count, plural, one {# contact rattach\xE9 \xE0 sa soci\xE9t\xE9} other {{n} contacts rattach\xE9s \xE0 leur soci\xE9t\xE9}}",
        contactsEnriched: "{count, plural, one {# fiche contact compl\xE9t\xE9e} other {{n} fiches contact compl\xE9t\xE9es}}",
        companiesEnriched: "{count, plural, one {# soci\xE9t\xE9 enrichie} other {{n} soci\xE9t\xE9s enrichies}}"
      }
    },
    newContacts: {
      line: "{count, plural, =0 {Aucun contact cr\xE9\xE9 ces {days} derniers jours.} one {# contact cr\xE9\xE9 ces {days} derniers jours, activable \xE0 {pct} (la base : {base}).} other {{n} contacts cr\xE9\xE9s ces {days} derniers jours, activables \xE0 {pct} (la base : {base}).}}",
      bySource: "Activables par origine : {list}",
      sourceItem: "{source} {pct} sur {n}"
    },
    createdByJipup: "Cr\xE9\xE9s par Jipup : {list}",
    createdContacts: "{count, plural, one {# contact} other {{n} contacts}}",
    createdCompanies: "{count, plural, one {# soci\xE9t\xE9} other {{n} soci\xE9t\xE9s}}"
  },
  problems: {
    title: "\xC0 r\xE9gler en priorit\xE9",
    description: "Class\xE9s par nombre de fiches touch\xE9es et par gravit\xE9. Une fiche de client ou d'opportunit\xE9 compte triple.",
    none: "Aucun probl\xE8me notable : votre base est saine sur tout ce que nous mesurons.",
    share: {
      contact: "{n} contacts sur {total} ({pct})",
      company: "{n} soci\xE9t\xE9s sur {total} ({pct})",
      activable: "{n} contacts sur {total} activables ({pct})"
    },
    segment: {
      contacts: "{count, plural, one {Dont # client ou opportunit\xE9} other {Dont {n} clients ou opportunit\xE9s}}",
      companies: "{count, plural, one {Dont # soci\xE9t\xE9 cliente ou en opportunit\xE9} other {Dont {n} soci\xE9t\xE9s clientes ou en opportunit\xE9}}"
    },
    activableIfFixed: "{count, plural, one {# contact deviendrait activable} other {{n} contacts deviendraient activables}} une fois ce point corrig\xE9.",
    fix: {
      agent: "Agent qui le r\xE8gle",
      credits: "Environ {n} cr\xE9dits",
      creditsPerPass: "Environ {n} cr\xE9dits par passage",
      open: "Configurer l'agent",
      manualLabel: "\xC0 faire",
      creditsAtMost: "Au plus {n} cr\xE9dits"
    },
    prompt: {
      copy: "Copier le prompt",
      copied: "Prompt copi\xE9",
      copyFailed: "Copie impossible, s\xE9lectionnez le texte ci-dessous",
      assistant: "R\xE9gler avec l'assistant",
      hint: "\xC0 coller dans l'assistant Jipup, Claude ou Codex connect\xE9 au MCP Jipup."
    },
    items: {
      duplicateContacts: {
        title: "Contacts en doublon",
        consequence: "La m\xEAme personne existe plusieurs fois : historique \xE9clat\xE9, relances en double, attribution des ventes fauss\xE9e.",
        manual: "Fusionner les doublons dans HubSpot, en commen\xE7ant par les clients."
      },
      duplicateCompanies: {
        title: "Soci\xE9t\xE9s en doublon",
        consequence: "Un m\xEAme compte est d\xE9coup\xE9 en plusieurs fiches : contacts, transactions et chiffre d'affaires dispers\xE9s.",
        manual: "Fusionner les soci\xE9t\xE9s en doublon dans HubSpot."
      },
      marketingUnreachable: {
        title: "Contacts marketing factur\xE9s mais injoignables",
        consequence: "En bounce, d\xE9sinscrits ou inactifs, ils sont pay\xE9s chaque mois \xE0 HubSpot et ne recevront aucun email, environ {amount} par an.",
        manual: "Les repasser en contacts non marketing dans HubSpot : HubSpot n'autorise pas ce changement depuis une application."
      },
      hardBounces: {
        title: "Adresses email en bounce d\xE9finitif",
        consequence: "Chaque envoi vers ces adresses \xE9choue et d\xE9grade la r\xE9putation de votre domaine pour tous vos autres emails.",
        manual: "V\xE9rifier ces adresses et chercher le nouvel email des personnes concern\xE9es."
      },
      likelyMoved: {
        title: "Contacts sans activit\xE9 depuis plus de 2 ans",
        consequence: "Une bonne partie a chang\xE9 de poste ou d'entreprise : vos \xE9quipes \xE9crivent \xE0 des personnes parties, et les anciens clients partis ailleurs ne sont pas relanc\xE9s.",
        manual: "V\xE9rifier le poste actuel de ces contacts sur LinkedIn."
      },
      missingEmail: {
        title: "Contacts sans email",
        consequence: "Impossible de les inclure dans une campagne ou une s\xE9quence.",
        manual: "Retrouver l'email professionnel de ces contacts."
      },
      noCompany: {
        title: "Contacts rattach\xE9s \xE0 aucune soci\xE9t\xE9",
        consequence: "Invisibles dans les vues par compte, ils \xE9chappent au ciblage et aux rapports par soci\xE9t\xE9.",
        manual: "Associer chaque contact \xE0 sa soci\xE9t\xE9 dans HubSpot."
      },
      missingJobTitle: {
        title: "Contacts sans poste",
        consequence: "Impossible de cibler les d\xE9cideurs ou de personnaliser un message selon la fonction.",
        manual: "Compl\xE9ter le poste depuis le profil LinkedIn de ces contacts."
      },
      noActiveOwner: {
        title: "Contacts sans propri\xE9taire actif",
        consequence: "Sans propri\xE9taire, ou d\xE9tenus par une personne qui a quitt\xE9 l'\xE9quipe : personne ne les suit, et les t\xE2ches qui leur sont assign\xE9es ne seront jamais faites.",
        manual: "Attribuer ces contacts dans HubSpot \xE0 une personne de l'\xE9quipe."
      },
      missingPhone: {
        title: "Contacts activables sans t\xE9l\xE9phone",
        consequence: "Joignables par email, mais vos commerciaux ne peuvent pas les appeler.",
        manual: "Retrouver le mobile de ces contacts."
      },
      incompleteCompanies: {
        title: "Soci\xE9t\xE9s sans domaine, secteur ou effectif",
        consequence: "Impossible de les segmenter, de les scorer ou de les rapprocher d'un compte cible.",
        manual: "Compl\xE9ter ces soci\xE9t\xE9s depuis leur page LinkedIn."
      },
      untreatedLeads: {
        title: "Leads entrants non trait\xE9s",
        consequence: "Ces personnes sont venues d'elles-m\xEAmes (formulaire, site, chat) il y a 7 \xE0 90 jours, et personne d'actif ne les suit ou rien n'a \xE9t\xE9 fait : la demande refroidit, ou part chez un concurrent.",
        manual: "Attribuer ces leads \xE0 une personne active de l'\xE9quipe et planifier un premier contact."
      },
      singleContactCustomers: {
        title: "Comptes clients avec un seul contact",
        consequence: "Toute la relation tient \xE0 une personne, ou \xE0 personne : si elle part, le compte devient muet, et vous ne pouvez pas \xE9largir la vente \xE0 d'autres \xE9quipes.",
        manual: "Ajouter dans HubSpot les autres interlocuteurs de ces comptes (d\xE9cideurs, utilisateurs, achats)."
      },
      unnormalizedCountries: {
        title: "Pays des contacts non normalis\xE9s",
        consequence: "Le m\xEAme pays est \xE9crit de plusieurs fa\xE7ons (casse, code, ville ou r\xE9gion devant) : les segments, les filtres et les rapports par pays oublient une partie des contacts.",
        manual: "Remplacer ces valeurs par le nom du pays, puis passer la propri\xE9t\xE9 Pays en liste d\xE9roulante pour la suite."
      }
    },
    sources: "Origine : {list}"
  },
  sources: {
    import: "import",
    jipup: "Jipup",
    integration: "autre int\xE9gration",
    manual: "saisie manuelle",
    api: "API",
    inbound: "entrant (formulaire, site)",
    other: "autre origine",
    unknown: "origine inconnue"
  },
  sourcesAnd: " et "
};
var catalog2 = {
  actionTypes: {
    email_verification: "V\xE9rification email",
    email_enrichment: "Enrichissement email",
    duplicate_merge: "D\xE9tection & fusion doublon",
    company_enrichment: "Enrichissement entreprise",
    contact_enrichment: "Enrichissement contact",
    job_change_scan: "Scan changement de poste",
    mobile_enrichment: "Enrichissement mobile",
    lead_qualification: "Qualification de lead",
    company_link: "Rattachement d'entreprise",
    legal_enrichment: "Enrichissement l\xE9gal France",
    domain_enrichment: "Nom de domaine",
    reverse_email_lookup: "Email reverse lookup",
    contact_linkedin_url_lookup: "Recherche d'URL LinkedIn contact",
    company_linkedin_url_lookup: "Recherche de page LinkedIn entreprise",
    new_hire_scan: "Scan nouvelles embauches",
    new_hire_delivery: "Nouvelle embauche",
    company_association: "Rattachement \xE0 une soci\xE9t\xE9",
    find_people: "Contacts trouv\xE9s"
  },
  actionHints: {
    email_enrichment: "(email professionnel du contact)",
    contact_enrichment: "(poste, localisation, identit\xE9, langue, depuis le profil LinkedIn)",
    company_enrichment: "(secteur, effectif, site web, adresse, description, depuis la page LinkedIn)",
    contact_linkedin_url_lookup: "(l'URL du profil, depuis le nom et l'entreprise)",
    company_linkedin_url_lookup: "(l'URL de la page, depuis le nom ou le domaine)",
    mobile_enrichment: "(num\xE9ro de mobile direct)",
    legal_enrichment: "(SIREN, SIRET, code APE ; source INSEE / data.gouv.fr)",
    domain_enrichment: "(domaine et site web des fiches qui n'en ont pas, depuis le nom, la ville et le SIREN)"
  },
  agents: {
    duplicate_detector: {
      name: "D\xE9tecteur de doublons",
      tagline: "D\xE9tecte et fusionne les doublons",
      description: "Identifie les doublons de contacts et d'entreprises, fusionne automatiquement les fiches lorsque la confiance est \xE9lev\xE9e, et met les cas douteux en validation manuelle."
    },
    job_change_tracker: {
      name: "Suivi des changements de poste",
      tagline: "Suit les changements de poste",
      description: "Surveille les changements de poste et cr\xE9e une t\xE2che commerciale lorsqu'un contact qualifi\xE9 rejoint une nouvelle entreprise, puis l'associe \xE0 la bonne fiche entreprise."
    },
    crm_enrichment: {
      name: "Agent d'enrichissement CRM",
      tagline: "Enrichit contacts et entreprises",
      description: "Compl\xE8te les fiches contacts et entreprises : email, mobile, LinkedIn, SIREN/SIRET, poste, secteur, effectif, site web, localisation. Vous ne payez que les enrichissements r\xE9ussis."
    },
    lead_qualifier: {
      name: "Qualification de leads",
      tagline: "Qualifie et priorise vos leads",
      description: "Analyse chaque contact et l'entreprise associ\xE9e, \xE9value son ad\xE9quation selon vos crit\xE8res (d\xE9crits en langage naturel), \xE9crit un score sur la fiche et cr\xE9e une t\xE2che commerciale pour les leads qualifi\xE9s. Id\xE9al pour trier un flux de leads entrants ou r\xE9activer une base."
    },
    reverse_email_lookup: {
      name: "Email reverse lookup",
      tagline: "Retrouve la personne derri\xE8re un email",
      description: "\xC0 partir du seul email (personnel ou professionnel), retrouve l'identit\xE9 compl\xE8te du contact : pr\xE9nom, nom, soci\xE9t\xE9, URL LinkedIn, poste, localisation et langue. Cr\xE9e ou rattache aussi la fiche entreprise de l'employeur (domaine, effectif, secteur, description\u2026). Le seul chemin pour les fiches issues d'un formulaire, d'un import ou d'un scan de badge. Factur\xE9 uniquement quand la personne est retrouv\xE9e et la fiche compl\xE9t\xE9e."
    },
    new_hire_tracker: {
      name: "D\xE9tection des nouvelles embauches",
      tagline: "Rep\xE8re les nouveaux arrivants sur vos fonctions cibles",
      description: "Sur une liste de soci\xE9t\xE9s de votre CRM, rep\xE8re \xE0 chaque passage les personnes arriv\xE9es r\xE9cemment sur les fonctions que vous ciblez (DRH, directeur commercial\u2026), cr\xE9e ou met \xE0 jour leur fiche contact et la rattache \xE0 la soci\xE9t\xE9. Factur\xE9 par soci\xE9t\xE9 scann\xE9e.",
      descriptionNoCreation: "Sur une liste de soci\xE9t\xE9s de votre CRM, rep\xE8re \xE0 chaque passage les personnes arriv\xE9es r\xE9cemment sur les fonctions que vous ciblez (DRH, directeur commercial\u2026), met \xE0 jour la fiche de celles d\xE9j\xE0 dans votre CRM et la rattache \xE0 la soci\xE9t\xE9. Factur\xE9 par soci\xE9t\xE9 scann\xE9e."
    },
    email_verification: {
      name: "V\xE9rification d'email",
      tagline: "V\xE9rifie les emails et \xE9crit le verdict sur la fiche",
      description: "V\xE9rifie chaque email chez BounceBan et \xE9crit sur la fiche s'il est d\xE9livrable, risky, ind\xE9livrable ou inconnu, avec la date et les indicateurs (adresse g\xE9n\xE9rique, email perso, jetable, catch-all). Un verdict inconnu n'est pas factur\xE9 et est rev\xE9rifi\xE9 trois jours plus tard. Factur\xE9 1 cr\xE9dit par email v\xE9rifi\xE9."
    },
    company_association: {
      name: "Rattacher les contacts \xE0 leur soci\xE9t\xE9",
      tagline: "Rattache les contacts sans soci\xE9t\xE9 \xE0 leur employeur actuel",
      description: "Trouve l'employeur actuel des contacts sans soci\xE9t\xE9 par LinkedIn ou leur email, retrouve ou cr\xE9e la soci\xE9t\xE9 dans le CRM et l'associe comme principale. Compl\xE8te au passage les champs vides du contact (nom, poste, lieu, langue) avec ce qu'il a lu, sans rien \xE9craser. L'association est gratuite, seules les recherches qui aboutissent sont factur\xE9es."
    }
  },
  plans: {
    free: {
      name: "Free",
      description: "Essayez Jipup gratuitement.",
      highlights: [
        "Acc\xE8s limit\xE9",
        "1 agent inclus"
      ]
    },
    starter: {
      name: "Starter",
      description: "Pour d\xE9marrer la maintenance automatique de votre CRM.",
      highlights: [
        "10 000 cr\xE9dits / mois",
        "3 agents inclus",
        "Cr\xE9dits report\xE9s le mois suivant"
      ]
    },
    growth: {
      name: "Growth",
      description: "Pour les \xE9quipes commerciales qui scalent.",
      highlights: [
        "35 000 cr\xE9dits / mois",
        "Validation manuelle avanc\xE9e",
        "Support prioritaire"
      ]
    },
    scale: {
      name: "Scale",
      description: "Pour les bases CRM volumineuses et multi-\xE9quipes.",
      highlights: [
        "100 000 cr\xE9dits / mois",
        "Volumes \xE9lev\xE9s par run",
        "R\xE8gles globales & SSO"
      ]
    }
  },
  frequencies: {
    weekly: "Chaque semaine",
    biweekly: "Toutes les 2 semaines",
    triweekly: "Toutes les 3 semaines",
    monthly: "Chaque mois"
  },
  enrichmentFields: {
    email: "Email",
    mobile_phone: "T\xE9l\xE9phone mobile",
    linkedin_url: "URL LinkedIn",
    siren_siret: "SIREN / SIRET",
    job_title: "Poste",
    industry: "Secteur",
    headcount: "Effectif",
    website: "Site web",
    location: "Localisation",
    description: "Description"
  },
  objects: {
    contact: "Contacts",
    company: "Entreprises",
    both: "Contacts et entreprises"
  },
  agentNames: {
    duplicate_detector: "D\xE9tection de doublons",
    job_change_tracker: "Suivi des changements de poste",
    crm_enrichment_contact: "Enrichissement Contacts",
    crm_enrichment_company: "Enrichissement Entreprises",
    lead_qualifier: "Qualification de leads",
    reverse_email_lookup: "Email reverse lookup",
    new_hire_tracker: "D\xE9tection des nouvelles embauches",
    email_verification: "V\xE9rification d'email",
    company_association: "Rattacher les contacts \xE0 leur soci\xE9t\xE9"
  },
  copySuffix: "(copie)"
};

// src/report-html.ts
var T = {
  canvas: "#ffffff",
  canvasSoft: "#fafafa",
  ink: "#171717",
  inkMute: "#707070",
  hairline: "#dfdfdf",
  primary: "#3ecf8e",
  primaryDeep: "#24b47e",
  success: "#157f5b",
  warning: "#c9a100",
  warningFg: "#4a3900",
  destructive: "#d1383d"
};
function severityForScore(score) {
  if (score === null) return "ok";
  if (score <= 65) return "critical";
  if (score <= 85) return "warning";
  return "ok";
}
var SEV_TEXT = { ok: T.success, warning: T.warningFg, critical: T.destructive };
var SEV_DOT = { ok: T.success, warning: T.warning, critical: T.destructive };
var PILLAR_ORDER = [
  "duplicates",
  "completeness",
  "staleness",
  "quality",
  "structure",
  "freshness",
  "deliverability",
  "pipeline",
  "schemaDebt"
];
var MAX_PROBLEMS = 5;
var EVIDENCE_ON_CARD = 3;
var SOURCES_ON_CARD = 3;
var APP = {
  en: { audit, catalog },
  fr: { audit: audit2, catalog: catalog2 }
};
var SKILL = {
  en: {
    title: "CRM Health Check",
    description: "A measured diagnosis of your HubSpot data health, read-only.",
    readOnly: "Read-only: nothing is modified in HubSpot",
    local: "Free: run on your machine, your data stays with you",
    generated: "Report generated on {date}",
    portal: "Portal {id}",
    scopeHint: "This pillar needs an extra permission on the private app ({scope}). Add it in HubSpot, then run the audit again.",
    fixWith: "Jipup fixes it with",
    fixLink: "See how",
    privacy: "This audit ran locally, read-only, against api.hubapi.com only. No CRM data left your machine.",
    cleanup: "You can now delete the private app in HubSpot (Settings > Integrations > Private Apps): the token goes with it.",
    cta: "Connect HubSpot to Jipup: the same audit runs on signup, every month after, and its agents fix these problems for you.",
    ctaLink: "Fix this automatically with Jipup",
    builtBy: "Built by"
  },
  fr: {
    title: "CRM Health Check",
    description: "Un diagnostic chiffr\xE9 de la sant\xE9 de vos donn\xE9es HubSpot, en lecture seule.",
    readOnly: "Lecture seule : rien n'est modifi\xE9 dans HubSpot",
    local: "Gratuit : ex\xE9cut\xE9 sur votre poste, la donn\xE9e reste chez vous",
    generated: "Rapport g\xE9n\xE9r\xE9 le {date}",
    portal: "Portail {id}",
    scopeHint: "Ce pilier n\xE9cessite une autorisation suppl\xE9mentaire sur l'application priv\xE9e ({scope}). Ajoutez-la dans HubSpot, puis relancez l'audit.",
    fixWith: "Jipup le r\xE8gle avec",
    fixLink: "Voir comment",
    privacy: "Cet audit s'est ex\xE9cut\xE9 en local, en lecture seule, uniquement contre api.hubapi.com. Aucune donn\xE9e CRM n'a quitt\xE9 votre poste.",
    cleanup: "Vous pouvez maintenant supprimer l'application priv\xE9e dans HubSpot (Param\xE8tres > Int\xE9grations > Applications priv\xE9es) : le token dispara\xEEt avec elle.",
    cta: "Connectez HubSpot \xE0 Jipup : le m\xEAme audit tourne \xE0 l'inscription puis chaque mois, et ses agents r\xE8glent ces probl\xE8mes pour vous.",
    ctaLink: "Corriger automatiquement avec Jipup",
    builtBy: "R\xE9alis\xE9 par"
  }
};
var CTA_URL = "https://jipup.com?utm_source=crm-health-check&utm_medium=html-report&utm_campaign=lead-magnet";
function formatMessage(template, vars, locale) {
  const plural = new Intl.PluralRules(locale);
  const nf = new Intl.NumberFormat(locale);
  let out = "";
  let i = 0;
  while (i < template.length) {
    const ch = template[i];
    if (ch !== "{") {
      out += ch;
      i++;
      continue;
    }
    const end = matching(template, i);
    const body = template.slice(i + 1, end);
    i = end + 1;
    const m = /^\s*(\w+)\s*,\s*(plural|select)\s*,([\s\S]*)$/.exec(body);
    if (!m) {
      const key = body.trim();
      out += key in vars ? String(vars[key]) : `{${key}}`;
      continue;
    }
    const [, name, kind, rest] = m;
    const options = /* @__PURE__ */ new Map();
    let j = 0;
    while (j < rest.length) {
      const sel = /^\s*(=?\w+)\s*\{/.exec(rest.slice(j));
      if (!sel) break;
      const open = j + sel[0].length - 1;
      const close = matching(rest, open);
      options.set(sel[1], rest.slice(open + 1, close));
      j = close + 1;
    }
    const value = vars[name];
    let branch;
    if (kind === "plural") {
      const n = Number(value);
      branch = options.get(`=${n}`) ?? options.get(plural.select(n)) ?? options.get("other");
      if (branch !== void 0) branch = replaceHash(branch, nf.format(n));
    } else {
      branch = options.get(String(value)) ?? options.get("other");
    }
    out += branch === void 0 ? "" : formatMessage(branch, vars, locale);
  }
  return out;
}
function matching(s, open) {
  let depth = 0;
  for (let k = open; k < s.length; k++) {
    if (s[k] === "{") depth++;
    else if (s[k] === "}" && --depth === 0) return k;
  }
  return s.length - 1;
}
function replaceHash(branch, n) {
  let out = "";
  let depth = 0;
  for (const ch of branch) {
    if (ch === "{") depth++;
    if (ch === "}") depth--;
    out += ch === "#" && depth === 0 ? n : ch;
  }
  return out;
}
function lookup(messages, path) {
  let node = messages;
  for (const part of path.split(".")) {
    if (node === null || typeof node !== "object") return null;
    node = node[part];
  }
  return typeof node === "string" ? node : null;
}
var svg = (body) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
var ICON = {
  calculator: svg(
    `<rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="16" y1="14" x2="16" y2="18"/><line x1="8" y1="10" x2="8.01" y2="10"/><line x1="12" y1="10" x2="12.01" y2="10"/><line x1="16" y1="10" x2="16.01" y2="10"/><line x1="8" y1="14" x2="8.01" y2="14"/><line x1="12" y1="14" x2="12.01" y2="14"/><line x1="8" y1="18" x2="8.01" y2="18"/><line x1="12" y1="18" x2="12.01" y2="18"/>`
  ),
  shield: svg(
    `<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1 1 0 0 1 1.52 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>`
  ),
  scan: svg(
    `<path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><circle cx="12" cy="12" r="3"/>`
  ),
  alert: svg(
    `<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>`
  ),
  arrow: svg(`<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>`),
  external: svg(`<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>`),
  lock: svg(`<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>`),
  chevron: svg(`<path d="m6 9 6 6 6-6"/>`)
};
function esc(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function findCheck(report, id) {
  for (const p of report.pillars) {
    const hit = p.checks.find((c) => c.id === id);
    if (hit) return hit;
  }
  return null;
}
function topProblems(report, max = MAX_PROBLEMS) {
  const all = report.problems ?? [];
  const serious = all.filter((p) => p.severity !== "ok");
  return (serious.length > 0 ? serious : all).slice(0, max);
}
function topSources(counts, max = SOURCES_ON_CARD) {
  if (!counts) return [];
  const total = Object.values(counts).reduce((s, n) => s + (n ?? 0), 0);
  if (total === 0) return [];
  const named = Object.entries(counts).filter(([s, n]) => s !== "unknown" && n > 0).sort((a, b) => b[1] - a[1]);
  const picked = named.slice(0, max);
  const jipup = named.find(([s]) => s === "jipup");
  if (jipup && !picked.includes(jipup)) picked.push(jipup);
  return picked.map(([source, count]) => ({ source, count, share: count / total }));
}
function detailLine(detail, labels) {
  if (!detail) return null;
  const s = (k) => {
    const v = detail[k];
    return v == null || v === "" ? null : String(v);
  };
  const dupName = s("duplicateOfName");
  if (dupName) {
    const score = s("score");
    return `${labels.duplicateOf} ${dupName}${score ? ` \xB7 ${score}/100` : ""}`;
  }
  const suggestion = s("suggestion");
  const email = s("email");
  if (suggestion && email) return `${email} \u2192 ${suggestion}`;
  const canonical = s("canonical");
  const value = s("value");
  if (canonical && value) return `"${value}" ${labels.instead} "${canonical}"`;
  const months = s("monthsSince");
  if (months) return `${months} ${labels.months}`;
  const idleDays = s("idleDays") ?? s("daysOverdue");
  if (idleDays) return `${idleDays} ${labels.days}`;
  const properties = detail.properties;
  if (Array.isArray(properties)) return properties.join(" \xB7 ");
  const filledInSample = s("filledInSample");
  const sampleSize = s("sampleSize");
  if (filledInSample && sampleSize) return `${labels.fill} ${filledInSample}/${sampleSize}`;
  const reason = s("reason");
  if (reason) return reason;
  return null;
}
function renderReportHtml(report, evidence, lang) {
  const locale = lang === "fr" ? "fr-FR" : "en-US";
  const app = APP[lang];
  const skill = SKILL[lang];
  const t = (key, vars = {}) => {
    const tpl2 = lookup(app.audit, key);
    return tpl2 === null ? key : formatMessage(tpl2, vars, locale);
  };
  const has = (key) => lookup(app.audit, key) !== null;
  const s = (key, vars = {}) => formatMessage(skill[key] ?? key, vars, locale);
  const agentName = (agent) => lookup(app.catalog, `agents.${agent}.name`);
  const nf = (n) => n.toLocaleString(locale);
  const eur = (n) => n.toLocaleString(locale, { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
  const pct = (r) => new Intl.NumberFormat(locale, { style: "percent", maximumFractionDigits: 0 }).format(r);
  const date = new Date(report.generatedAt).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  const evidenceByCheck = /* @__PURE__ */ new Map();
  for (const e of evidence) {
    const b = evidenceByCheck.get(e.checkId) ?? [];
    b.push(e);
    evidenceByCheck.set(e.checkId, b);
  }
  const detailLabels = {
    duplicateOf: t("evidence.duplicateOf"),
    instead: t("evidence.instead"),
    months: t("evidence.monthsAgo"),
    days: t("evidence.days"),
    fill: t("evidence.filled")
  };
  const recordLink = (e) => {
    const name = esc(e.objectName ?? e.objectId);
    return e.hubspotUrl ? `<a class="rec" href="${esc(e.hubspotUrl)}" target="_blank" rel="noopener">${name}<span class="ext">${ICON.external}</span></a>` : `<span class="rec">${name}</span>`;
  };
  const analysed = report.pillars.filter((p) => p.score !== null).length;
  const capped = report.scanned.contactsCapped || report.scanned.companiesCapped || report.scanned.dealsCapped;
  const severity = severityForScore(report.score);
  const verdictKey = report.score >= 85 ? "excellent" : report.score >= 70 ? "good" : report.score >= 50 ? "fair" : "poor";
  const cap = report.scoreCap ?? null;
  const scoreBlock = `<div class="stack-2">
    <p class="mute">${t("score.label")}</p>
    <p class="big-line"><span class="big" style="color:${SEV_TEXT[severity]}">${report.score}</span><span class="denom">/100</span></p>
    <p>${t(`score.verdict.${verdictKey}`)}</p>
    ${cap ? `<p class="mute small narrow">${esc(
    t("score.capped", {
      max: cap.max,
      mean: cap.uncappedScore,
      count: cap.checks.length,
      checks: cap.checks.map((id) => t(`checks.${id}`)).join(", ")
    })
  )}</p>` : ""}
    <div class="progress"><div style="width:${report.score}%;background:${SEV_DOT[severity]}"></div></div>
  </div>`;
  const a = report.activation ?? null;
  const share = a && a.contacts > 0 ? a.activable / a.contacts : null;
  const nc = report.newContacts ?? null;
  const intakeSources = nc?.bySource ? topSources(Object.fromEntries(nc.bySource.map((x) => [x.source, x.contacts]))).map((x) => {
    const row = nc.bySource.find((b) => b.source === x.source);
    return t("overview.newContacts.sourceItem", {
      source: t(`sources.${x.source}`),
      pct: pct(row.activable / row.contacts),
      n: nf(row.contacts)
    });
  }) : [];
  const jipupContacts = report.sources?.contacts?.jipup ?? 0;
  const jipupCompanies = report.sources?.companies?.jipup ?? 0;
  const createdByJipup = [
    ...jipupContacts ? [t("overview.createdContacts", { count: jipupContacts, n: nf(jipupContacts) })] : [],
    ...jipupCompanies ? [t("overview.createdCompanies", { count: jipupCompanies, n: nf(jipupCompanies) })] : []
  ];
  const activableBlock = a ? `<p class="big-line"><span class="big">${nf(a.activable)}</span>
         <span class="denom">${t("overview.activable.of", { total: nf(a.contacts) })}</span>
         ${share !== null ? `<span class="mute">(${pct(share)})</span>` : ""}</p>
       <p>${t("overview.activable.callable", { count: a.callable, n: nf(a.callable) })}</p>
       <p class="mute small narrow">${t(a.ownerRule === "active" ? "overview.activable.rule" : "overview.activable.ruleAssigned")}</p>
       <dl class="missing">${["email", "company", "jobTitle", "owner"].map((k) => `<div><dt>${t(`overview.missing.${k}`)}</dt><dd>${nf(a.missing[k])}</dd></div>`).join("")}</dl>
       <p class="mute small">${t("overview.missing.note")}</p>
       ${nc && share !== null ? `<div class="intake"><p>${t("overview.newContacts.line", {
    count: nc.contacts,
    n: nf(nc.contacts),
    days: nc.windowDays,
    pct: nc.contacts > 0 ? pct(nc.activable / nc.contacts) : "",
    base: pct(share)
  })}</p>
             ${nc.contacts > 0 && intakeSources.length > 1 ? `<p class="mute small">${t("overview.newContacts.bySource", { list: intakeSources.join(", ") })}</p>` : ""}</div>` : ""}
       ${createdByJipup.length ? `<p class="mute small">${t("overview.createdByJipup", { list: createdByJipup.join(t("sourcesAnd")) })}</p>` : ""}` : `<p class="mute">${t("overview.activable.unavailable")}</p>`;
  const overviewSection = `<div class="card overview">
    <div class="stack-2"><p class="mute">${t("overview.activable.label")}</p>${activableBlock}</div>
    ${scoreBlock}
  </div>`;
  const problemCard = (p, position) => {
    const ratio = p.total > 0 ? p.affected / p.total : 0;
    const values = {
      count: p.affected,
      n: nf(p.affected),
      total: nf(p.total),
      pct: pct(ratio),
      amount: p.eurosPerYear != null ? eur(p.eurosPerYear) : ""
    };
    const sources = topSources(p.bySource);
    const rows = (evidenceByCheck.get(p.evidenceCheckId ?? p.checkId) ?? []).slice(0, EVIDENCE_ON_CARD);
    const evidenceList = rows.length ? `<ul class="evidence">${rows.map((f) => {
      const missing = Array.isArray(f.detail?.missing) ? f.detail.missing.filter((k) => has(`evidence.missing.${k}`)) : null;
      const line = missing ? missing.map((k) => t(`evidence.missing.${k}`)).join(" \xB7 ") || null : detailLine(f.detail, detailLabels);
      return `<li>${recordLink(f)}${line ? ` <span class="mute">${esc(line)}</span>` : ""}</li>`;
    }).join("")}</ul>` : "";
    const name = p.agent ? agentName(p.agent) : null;
    const fix = name ? `<p class="mute">${s("fixWith")}</p>
         <p class="fix-name">${esc(name)}</p>
         <a class="fix-link" href="${CTA_URL}">${s("fixLink")} <span class="arrow">${ICON.arrow}</span></a>` : `<p class="mute">${t("problems.fix.manualLabel")}</p><p>${t(`problems.items.${p.id}.manual`)}</p>`;
    return `<li class="card problem">
      <div class="stack-2">
        <div class="problem-head">
          <span class="pos">${position}</span>
          <div>
            <h3><span class="dot" style="background:${SEV_DOT[p.severity]}"></span>${t(`problems.items.${p.id}.title`, values)}</h3>
            <p class="mute small">${t(p.base === "activable" ? "problems.share.activable" : `problems.share.${p.object}`, values)}</p>
          </div>
        </div>
        <p>${t(`problems.items.${p.id}.consequence`, values)}</p>
        ${p.champions ? `<p class="small">${t(p.object === "contact" ? "problems.segment.contacts" : "problems.segment.companies", {
      count: p.champions,
      n: nf(p.champions)
    })}</p>` : ""}
        ${p.activableIfFixed ? `<p class="mute small">${t("problems.activableIfFixed", { count: p.activableIfFixed, n: nf(p.activableIfFixed) })}</p>` : ""}
        ${sources.length ? `<p class="mute small">${t("problems.sources", {
      list: sources.map((x) => `${t(`sources.${x.source}`)} ${pct(x.share)}`).join(", ")
    })}</p>` : ""}
        ${evidenceList}
      </div>
      <div class="fix">${fix}</div>
    </li>`;
  };
  const problems = topProblems(report);
  const problemsSection = report.problems ? `<section class="stack-3">
        <div><h2>${t("problems.title")}</h2><p class="mute">${t("problems.description")}</p></div>
        ${problems.length ? `<ol class="problems">${problems.map((p, i) => problemCard(p, i + 1)).join("")}</ol>` : `<div class="card pad mute">${t("problems.none")}</div>`}
      </section>` : "";
  const o = report.opportunity;
  const byReach = report.activation != null;
  const measuredHeadcount = report.owningOwners && report.owningOwners > 0 ? report.owningOwners : null;
  const tpl = (key) => lookup(app.audit, key) ?? key;
  const impactConfig = {
    locale,
    unusable: byReach ? report.activation.unreachable : report.waste?.unusableContacts ?? 0,
    totalContacts: report.scanned.contacts,
    departureRate: o?.departureRate ?? 0,
    defaults: {
      averageDeal: o?.averageDealEuros ?? 1e4,
      winRate: Math.round((o?.assumedWinRate ?? 0.5) * 100),
      customers: o?.customers ?? 0,
      headcount: measuredHeadcount ?? 3,
      contactsPerDay: 25,
      minutesPerRecord: 4,
      monthlyCost: 5e3
    },
    strings: {
      hours: tpl("impact.units.hours"),
      minutes: tpl("impact.units.minutes"),
      timeLostUnit: tpl("impact.results.timeLostUnit"),
      timeLostCost: tpl("impact.results.timeLostCost"),
      howTimeLost: tpl(byReach ? "impact.how.timeLostReach" : "impact.how.timeLost"),
      howPipelineLost: tpl("impact.how.pipelineLost")
    }
  };
  const stepper = (id, label, hint, min, max, step) => `<div class="stepper">
    <label for="in-${id}">${label}</label>
    <div class="stepper-ctl">
      <button type="button" data-step="-${step}" data-for="${id}" aria-label="-">\u2212</button>
      <input id="in-${id}" data-input="${id}" type="text" inputmode="numeric" data-min="${min}" data-max="${max}">
      <button type="button" data-step="${step}" data-for="${id}" aria-label="+">+</button>
    </div>
    <p class="hint">${hint}</p>
  </div>`;
  const measuredOr = (isMeasured) => t(isMeasured ? "impact.measured" : "impact.assumption");
  const waste = report.waste;
  const impactSection = `<div class="card pad">
    <div class="section-head">
      <span class="chip-icon">${ICON.calculator}</span>
      <div><h2>${t("impact.title")}</h2><p class="mute">${t("impact.description")}</p></div>
    </div>
    <div class="results">
      <div class="result"><p class="mute small">${t("impact.results.timeLost")}</p>
        <p class="result-value">\u2212 <span id="r-time"></span></p>
        <p class="mute small" id="r-time-unit"></p><p class="mute small" id="r-time-cost"></p></div>
      <div class="result"><p class="mute small">${t("impact.results.pipelineLost")}</p>
        <p class="result-value">\u2212 <span id="r-pipeline"></span></p>
        <p class="mute small">${t("impact.results.pipelineLostUnit")}</p></div>
      <div class="result"><p class="mute small">${t("impact.results.ifFixed")}</p>
        <p class="result-value" style="color:${T.success}">+ <span id="r-fixed"></span></p>
        <p class="mute small">${t("impact.results.ifFixedUnit")}</p></div>
    </div>
    <details class="fold">
      <summary><span class="chev">${ICON.chevron}</span>${t("impact.inputs.toggle")}</summary>
      <div class="stepper-grid">
        ${stepper("averageDeal", t("impact.inputs.averageDeal"), measuredOr(!!o && o.averageDealSource !== "default"), 100, 1e7, 1e3)}
        ${stepper("winRate", t("impact.inputs.winRate"), t("impact.assumption"), 0, 100, 5)}
        ${stepper("customers", t("impact.inputs.customers"), measuredOr(o?.customersSource === "crm"), 0, 1e6, 10)}
        ${stepper("headcount", t("impact.inputs.headcount"), measuredHeadcount !== null ? t("impact.inputs.headcountMeasured") : t("impact.assumption"), 1, 500, 1)}
        ${stepper("contactsPerDay", t("impact.inputs.contactsPerDay"), t("impact.assumption"), 1, 500, 5)}
        ${stepper("minutesPerRecord", t("impact.inputs.minutesPerRecord"), t("impact.inputs.minutesPerRecordHint"), 1, 120, 1)}
        ${stepper("monthlyCost", t("impact.inputs.monthlyCost"), t("impact.inputs.monthlyCostHint"), 500, 1e5, 500)}
      </div>
    </details>
    ${waste && waste.eurosPerYear >= 1 ? `<p class="mute small">${t(waste.basis === "marketing" ? "impact.storageMarketing" : "impact.storage", {
    amount: eur(waste.eurosPerYear),
    unusable: nf(waste.unusableContacts),
    marketing: nf(waste.marketingContacts ?? 0)
  })}</p>` : ""}
    <details class="fold how">
      <summary><span class="chev">${ICON.chevron}</span>${t("impact.how.title")}</summary>
      <p id="how-time"></p>
      <p id="how-pipeline"></p>
      <p>${t("impact.how.ifFixed")}</p>
    </details>
  </div>`;
  const completenessGroup = (object, label) => {
    const pillar = report.pillars.find((p) => p.id === "completeness");
    if (!pillar) return "";
    const rows = pillar.checks.filter((c) => c.id.startsWith(`completeness.${object}.`) && !c.skipped && c.score !== null && c.total > 0).map((c) => ({ id: c.id, missing: c.ratio })).sort((x, y) => y.missing - x.missing);
    if (rows.length === 0) return "";
    const bars = rows.map((r) => {
      const sev = severityForScore(Math.round((1 - r.missing) * 100));
      const width = r.missing > 0 ? Math.max(r.missing * 100, 0.5) : 0;
      return `<div class="bar-row">
          <div class="bar-head"><span>${t(`checks.${r.id}`)}</span>
            <span class="bar-pct" style="color:${SEV_TEXT[sev]}">${pct(r.missing)}</span></div>
          <div class="track"><div class="bar" style="width:${width.toFixed(1)}%;background:${SEV_DOT[sev]}"></div></div>
        </div>`;
    }).join("");
    return `<div><p class="group-label">${label}</p>${bars}</div>`;
  };
  const contactsGroup = completenessGroup("contact", t("completenessChart.contacts"));
  const companiesGroup = completenessGroup("company", t("completenessChart.companies"));
  const completenessSection = contactsGroup || companiesGroup ? `<div class="card pad">
          <div><h2>${t("completenessChart.title")}</h2><p class="mute">${t("completenessChart.description")}</p></div>
          <div class="grid-2 gap-lg">${contactsGroup}${companiesGroup}</div>
        </div>` : "";
  const activity = report.distributions?.contactActivity;
  let ageSection = "";
  if (activity && activity.total > 0) {
    const max = Math.max(...activity.buckets.map((b) => b.contacts), 1);
    const OPACITY = { lt3: 0.25, m3to6: 0.45, m6to12: 0.65, m12to24: 0.85, gt24: 1 };
    const cols = activity.buckets.map((b) => {
      const h = Math.max(b.contacts / max * 100, b.contacts > 0 ? 2 : 0);
      const fillStyle = b.id === "never" ? `background:${T.inkMute};opacity:0.3` : `background:${T.primary};opacity:${OPACITY[b.id] ?? 1}`;
      return `<div class="age-col"><span class="age-count">${nf(b.contacts)}</span>
          <div class="age-slot"><div class="age-bar" style="height:${h.toFixed(1)}%;${fillStyle}"></div></div></div>`;
    }).join("");
    const labels = activity.buckets.map((b) => `<span class="age-label">${t(`activityChart.buckets.${b.id}`)}</span>`).join("");
    ageSection = `<div class="card pad">
      <div><h2>${t("activityChart.title")}</h2><p class="mute">${t("activityChart.description")}</p></div>
      <div class="age-chart">${cols}</div>
      <div class="age-labels">${labels}</div>
      <p class="mute small">${t("activityChart.activeShare", { share: pct(activity.activeLast12Months / activity.total) })}</p>
    </div>`;
  }
  const meter = (label, ratio, caption) => {
    const sev = severityForScore(Math.round(ratio * 100));
    return `<div class="bar-row">
      <div class="bar-head"><span>${label}</span><span class="bar-pct" style="color:${SEV_TEXT[sev]}">${pct(ratio)}</span></div>
      <div class="track"><div class="bar" style="width:${Math.max(ratio * 100, 1).toFixed(1)}%;background:${SEV_DOT[sev]}"></div></div>
      <p class="mute small">${caption}</p>
    </div>`;
  };
  const noOwner = findCheck(report, "structure.contact.noOwner");
  const never = findCheck(report, "freshness.contact.neverContacted");
  const ownerOk = !!noOwner && !noOwner.skipped && noOwner.score !== null;
  const neverOk = !!never && !never.skipped && never.score !== null;
  const ownershipCard = ownerOk || neverOk ? `<div class="card pad">
          <h2>${t("ownership.title")}</h2>
          ${ownerOk ? meter(t("ownership.withOwner"), noOwner.total > 0 ? 1 - noOwner.ratio : 0, `${nf(noOwner.total - noOwner.affected)} / ${nf(noOwner.total)}`) : ""}
          ${neverOk ? meter(t("ownership.withActivity"), 1 - never.ratio, `${nf(never.total - never.affected)} / ${nf(never.total)}`) : ""}
          ${ownerOk ? `<div class="unassigned"><p class="mute small">${t("ownership.unassigned")}</p><p class="unassigned-num">${nf(noOwner.affected)}</p></div>` : ""}
        </div>` : "";
  const lifecycle2 = report.distributions?.lifecycle;
  let lifecycleCard = "";
  if (lifecycle2 && lifecycle2.length > 0) {
    const maxStage = Math.max(...lifecycle2.map((st) => st.contacts), 1);
    const rows = lifecycle2.map((st) => {
      const label = has(`lifecycleChart.stages.${st.stage}`) ? t(`lifecycleChart.stages.${st.stage}`) : esc(st.stage.charAt(0).toUpperCase() + st.stage.slice(1));
      return `<div class="bar-row">
          <div class="bar-head"><span>${label}</span><span class="bar-pct">${nf(st.contacts)}</span></div>
          <div class="track"><div class="bar" style="width:${Math.max(st.contacts / maxStage * 100, 1).toFixed(1)}%;background:${T.primary}"></div></div>
        </div>`;
    }).join("");
    lifecycleCard = `<div class="card pad"><div><h2>${t("lifecycleChart.title")}</h2><p class="mute">${t("lifecycleChart.description")}</p></div>${rows}</div>`;
  }
  const funnelSection = ownershipCard || lifecycleCard ? `<div class="grid-2 gap">${ownershipCard}${lifecycleCard}</div>` : "";
  const note = (text) => `<p class="note">${esc(text)}</p>`;
  const checkRow = (c) => {
    const label = t(`checks.${c.id}`);
    if (c.skipped) {
      return `<div class="check-row"><div class="check-top"><span class="mute">${label}</span>
        <span class="mute small">${t(`skipped.${c.skipped}`)}</span></div></div>`;
    }
    const rows = evidenceByCheck.get(c.id) ?? [];
    return `<div class="check-row">
      <div class="check-top">
        <span class="check-label"><span class="dot" style="background:${SEV_DOT[c.severity]}"></span>${label}</span>
        <span class="check-count"><b style="color:${SEV_TEXT[c.severity]}">${nf(c.affected)}</b>
          <span class="mute"> / ${nf(c.total)} \xB7 ${Math.round(c.ratio * 100)}%</span></span>
      </div>
      ${c.meta?.estimate ? note(t("checkNotes.estimate", { rate: String(c.meta.assumptionAnnualTurnoverPct ?? "") })) : ""}
      ${c.id === "deliverability.ghost" && c.meta?.minDeliveries ? note(t("checkNotes.ghost", { min: String(c.meta.minDeliveries) })) : ""}
      ${c.id === "deliverability.marketingWaste" && c.affected > 0 ? note(
      t("checkNotes.marketingWaste", {
        hardBounced: nf(Number(c.meta?.hardBounced ?? 0)),
        optedOut: nf(Number(c.meta?.optedOut ?? 0)),
        ghost: nf(Number(c.meta?.ghost ?? 0)),
        min: String(c.meta?.minDeliveries ?? "")
      })
    ) : ""}
      ${c.weight === 0 ? note(t("checkNotes.unscored")) : ""}
      ${c.sampled ? note(t("checkNotes.sampled", { size: nf(c.sampleSize ?? 0) })) : ""}
      ${rows.length ? `<details class="samples"><summary>${t("evidence.show", { count: rows.length })}</summary>
              <ul class="evidence">${rows.map((f) => {
      const line = detailLine(f.detail, detailLabels);
      return `<li>${recordLink(f)}${line ? ` <span class="mute">${esc(line)}</span>` : ""}</li>`;
    }).join("")}</ul></details>` : ""}
    </div>`;
  };
  const pillarCard = (p) => {
    const head = p.score === null ? `<span class="pill-na">${ICON.lock}${t("notAnalysed")}</span>` : `<span class="pill-score" style="color:${SEV_TEXT[p.severity]}">${p.score}<span class="mute small">/100</span></span>`;
    const body = p.skipped === "missing_scope" ? `<p class="scope-hint">${esc(s("scopeHint", { scope: p.requiredScope ?? "" }))}</p>` : `<div class="checks">${p.checks.map(checkRow).join("")}</div>`;
    return `<div class="card pad-sm">
      <div class="pillar-head"><div><h3>${t(`pillars.${p.id}.name`)}</h3><p class="mute small">${t(`pillars.${p.id}.description`)}</p></div>${head}</div>
      ${body}
    </div>`;
  };
  const ordered = PILLAR_ORDER.map((id) => report.pillars.find((p) => p.id === id)).filter(
    (p) => Boolean(p)
  );
  const detailSection = ordered.length ? `<details class="card detail">
        <summary><div><h2>${t("detail.title")}</h2><p class="mute">${t("detail.description")}</p></div>
          <span class="toggle mute"><span class="show">${t("detail.show")}</span><span class="hide">${t("detail.hide")}</span><span class="chev">${ICON.chevron}</span></span></summary>
        <div class="pillars">${ordered.map(pillarCard).join("")}</div>
      </details>` : "";
  const main2 = analysed === 0 ? `<div class="card pad"><h2>${t("emptyPortal.title")}</h2><p class="mute">${t("emptyPortal.description")}</p></div>` : `<div class="stack-1">
          <h1 class="headline">${t("headline.title")}</h1>
          <p class="mute">${t("headline.summary", { contacts: nf(report.scanned.contacts), score: report.score })}</p>
        </div>
        ${report.problems ? overviewSection : `<div class="card pad">${scoreBlock}</div>`}
        ${problemsSection}
        ${impactSection}
        ${completenessSection}
        ${ageSection}
        ${funnelSection}
        ${capped ? `<div class="capped">${ICON.alert}<p>${t("cappedNotice")}</p></div>` : ""}
        ${detailSection}`;
  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${s("title")}${report.portalId ? ` \xB7 ${esc(String(report.portalId))}` : ""}</title>
<style>
  :root { color-scheme: light; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${T.canvasSoft}; color: ${T.ink}; font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
    line-height: 1.5; padding: 40px 16px 64px; font-size: 14px; }
  .wrap { max-width: 980px; margin: 0 auto; display: flex; flex-direction: column; gap: 24px; }
  h1 { font-size: 15px; font-weight: 550; }
  h1.headline { font-size: 28px; font-weight: 550; letter-spacing: -0.02em; }
  h2 { font-size: 16px; font-weight: 550; }
  h3 { font-size: 14px; font-weight: 550; }
  a { color: inherit; }
  ul, ol { list-style: none; }
  .mute { color: ${T.inkMute}; }
  .small { font-size: 12px; }
  .narrow { max-width: 36rem; }
  .stack-1 > * + * { margin-top: 4px; }
  .stack-2 > * + * { margin-top: 8px; }
  .stack-3 > * + * { margin-top: 12px; }
  .brand { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 8px 24px; align-items: baseline; }
  .badges { display: flex; flex-wrap: wrap; gap: 6px 16px; font-size: 12.5px; color: ${T.inkMute}; }
  .badge { display: inline-flex; align-items: center; gap: 6px; }
  .badge svg { width: 14px; height: 14px; }
  .card { background: ${T.canvas}; border: 1px solid ${T.hairline}; border-radius: 12px; }
  .pad { padding: 24px; display: flex; flex-direction: column; gap: 16px; }
  .pad-sm { padding: 20px; display: flex; flex-direction: column; gap: 12px; }
  .grid-2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); }
  .gap { gap: 16px; } .gap-lg { gap: 24px 40px; }
  /* Overview */
  .overview { padding: 24px; display: grid; gap: 32px; grid-template-columns: 3fr 2fr; }
  @media (max-width: 760px) { .overview { grid-template-columns: 1fr; } }
  .big-line { display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 8px; }
  .big { font-size: 48px; font-weight: 550; letter-spacing: -0.02em; font-variant-numeric: tabular-nums; line-height: 1.1; }
  .denom { font-size: 18px; color: ${T.inkMute}; }
  .progress { height: 6px; border-radius: 3px; background: ${T.canvasSoft}; border: 1px solid ${T.hairline}; overflow: hidden; }
  .progress > div { height: 100%; border-radius: 3px; }
  .missing { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 4px 24px; max-width: 36rem;
    border-top: 1px solid ${T.hairline}; padding-top: 12px; font-size: 12px; }
  @media (max-width: 520px) { .missing { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
  .missing dt { color: ${T.inkMute}; }
  .missing dd { font-weight: 550; font-variant-numeric: tabular-nums; }
  .intake { border-top: 1px solid ${T.hairline}; padding-top: 12px; }
  /* Problems */
  .problems { display: flex; flex-direction: column; gap: 12px; }
  .problem { padding: 20px; display: grid; gap: 16px; grid-template-columns: 1fr 16rem; }
  @media (max-width: 760px) { .problem { grid-template-columns: 1fr; } }
  .problem-head { display: flex; gap: 12px; align-items: flex-start; }
  .pos { flex: none; width: 24px; height: 24px; border: 1px solid ${T.hairline}; border-radius: 50%; display: inline-flex;
    align-items: center; justify-content: center; font-size: 12px; font-weight: 550; font-variant-numeric: tabular-nums; }
  .problem h3 { display: flex; align-items: center; gap: 8px; }
  .dot { flex: none; width: 6px; height: 6px; border-radius: 50%; display: inline-block; }
  .evidence { border-left: 1px solid ${T.hairline}; padding-left: 12px; display: flex; flex-direction: column; gap: 4px; font-size: 12px; }
  .rec { font-weight: 550; text-decoration: none; display: inline-flex; align-items: center; gap: 4px; }
  a.rec:hover { text-decoration: underline; }
  .ext svg { width: 12px; height: 12px; display: block; }
  .fix { align-self: start; border: 1px solid ${T.hairline}; background: ${T.canvasSoft}; border-radius: 10px; padding: 16px;
    font-size: 12px; display: flex; flex-direction: column; gap: 8px; }
  .fix-name { font-size: 14px; font-weight: 550; }
  .fix-link { font-weight: 550; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; }
  .fix-link:hover { text-decoration: underline; }
  .arrow svg { width: 14px; height: 14px; display: block; }
  /* Impact */
  .section-head { display: flex; gap: 12px; align-items: flex-start; }
  .chip-icon { flex: none; display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px;
    border-radius: 8px; background: rgba(62,207,142,0.15); }
  .chip-icon svg { width: 16px; height: 16px; }
  .results { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; }
  .result { border: 1px solid ${T.hairline}; border-radius: 10px; padding: 16px; }
  .result-value { font-size: 24px; font-weight: 550; letter-spacing: -0.01em; font-variant-numeric: tabular-nums; margin: 4px 0 2px; }
  .fold summary { cursor: pointer; list-style: none; display: inline-flex; align-items: center; gap: 6px; color: ${T.inkMute}; font-size: 13.5px; }
  .fold summary::-webkit-details-marker { display: none; }
  .fold summary:hover { color: ${T.ink}; }
  .chev svg { width: 16px; height: 16px; display: block; transition: transform .15s; }
  details[open] > summary .chev svg { transform: rotate(180deg); }
  .fold .stepper-grid { margin-top: 12px; }
  .how { border-top: 1px solid ${T.hairline}; padding-top: 16px; }
  .how p { margin-top: 12px; font-size: 12px; line-height: 1.6; color: ${T.inkMute}; }
  .stepper-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; }
  .stepper label { font-size: 12.5px; font-weight: 550; display: block; margin-bottom: 6px; }
  .stepper-ctl { display: flex; border: 1px solid ${T.hairline}; border-radius: 8px; overflow: hidden; background: ${T.canvas}; }
  .stepper-ctl button { width: 36px; border: none; background: ${T.canvasSoft}; font-size: 16px; cursor: pointer; color: ${T.ink}; }
  .stepper-ctl button:hover { background: #f0f0f0; }
  .stepper-ctl input { flex: 1; min-width: 0; border: none; text-align: center; font: inherit; font-variant-numeric: tabular-nums;
    padding: 8px 4px; outline: none; background: transparent; color: ${T.ink}; }
  .hint { font-size: 11px; color: ${T.inkMute}; margin-top: 4px; }
  /* Bars */
  .group-label { font-size: 11px; font-weight: 550; text-transform: uppercase; letter-spacing: 0.08em; color: ${T.inkMute}; margin-bottom: 10px; }
  .bar-row { margin-bottom: 12px; }
  .bar-head { display: flex; justify-content: space-between; gap: 12px; margin-bottom: 4px; }
  .bar-pct { font-size: 12px; font-weight: 550; font-variant-numeric: tabular-nums; }
  .track { height: 6px; border-radius: 3px; background: ${T.canvasSoft}; border: 1px solid ${T.hairline}; overflow: hidden; }
  .bar { height: 100%; border-radius: 3px; }
  .unassigned { border-top: 1px solid ${T.hairline}; padding-top: 12px; }
  .unassigned-num { font-size: 24px; font-weight: 550; font-variant-numeric: tabular-nums; color: ${T.warningFg}; }
  .age-chart { display: flex; align-items: flex-end; gap: 8px; height: 9rem; }
  .age-col { flex: 1; min-width: 0; display: flex; flex-direction: column; align-items: center; gap: 6px; height: 100%; }
  .age-count { font-size: 12px; font-weight: 550; font-variant-numeric: tabular-nums; }
  .age-slot { flex: 1; width: 100%; display: flex; align-items: flex-end; }
  .age-bar { width: 100%; border-radius: 4px 4px 0 0; }
  .age-labels { display: flex; gap: 8px; border-top: 1px solid ${T.hairline}; padding-top: 8px; }
  .age-label { flex: 1; min-width: 0; text-align: center; font-size: 11.5px; color: ${T.inkMute}; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .capped { display: flex; gap: 10px; align-items: flex-start; border: 1px solid ${T.hairline}; background: ${T.canvas}; border-radius: 10px; padding: 16px; color: ${T.inkMute}; }
  .capped svg { width: 16px; height: 16px; flex: none; margin-top: 2px; }
  /* Detail */
  .detail > summary { cursor: pointer; list-style: none; padding: 20px; display: flex; justify-content: space-between; align-items: center; gap: 16px; }
  .detail > summary::-webkit-details-marker { display: none; }
  .toggle { display: inline-flex; align-items: center; gap: 6px; flex: none; font-size: 13.5px; }
  .detail .hide, .detail[open] .show { display: none; }
  .detail[open] .hide { display: inline; }
  .pillars { border-top: 1px solid ${T.hairline}; padding: 20px; display: grid; gap: 16px; grid-template-columns: repeat(auto-fit, minmax(360px, 1fr)); }
  @media (max-width: 520px) { .pillars { grid-template-columns: 1fr; } }
  .pillar-head { display: flex; justify-content: space-between; gap: 16px; align-items: flex-start; }
  .pill-score { font-size: 18px; font-weight: 550; font-variant-numeric: tabular-nums; white-space: nowrap; }
  .pill-na { display: inline-flex; align-items: center; gap: 6px; flex: none; border: 1px solid ${T.hairline}; background: ${T.canvasSoft};
    border-radius: 999px; padding: 2px 8px; font-size: 12px; color: ${T.inkMute}; }
  .pill-na svg { width: 12px; height: 12px; }
  .scope-hint { border: 1px solid ${T.hairline}; background: ${T.canvasSoft}; border-radius: 8px; padding: 12px; font-size: 12px; color: ${T.inkMute}; }
  .checks > * + * { border-top: 1px solid ${T.hairline}; }
  .check-row { padding: 10px 0; }
  .check-top { display: flex; justify-content: space-between; gap: 16px; align-items: baseline; font-size: 13.5px; }
  .check-label { display: inline-flex; align-items: center; gap: 8px; }
  .check-count { flex: none; font-variant-numeric: tabular-nums; }
  .note { margin-top: 4px; padding-left: 14px; font-size: 12px; color: ${T.inkMute}; }
  .samples { margin-top: 6px; padding-left: 14px; }
  .samples summary { cursor: pointer; list-style: none; font-size: 12px; color: ${T.inkMute}; }
  .samples summary::-webkit-details-marker { display: none; }
  .samples summary:hover { text-decoration: underline; }
  .samples .evidence { margin-top: 8px; }
  /* Footer */
  footer { font-size: 12.5px; color: ${T.inkMute}; display: flex; flex-direction: column; gap: 8px; }
  .cta-btn { align-self: flex-start; padding: 10px 18px; border-radius: 8px; background: ${T.primary}; color: ${T.ink}; font-weight: 550;
    font-size: 13.5px; text-decoration: none; }
  .cta-btn:hover { background: ${T.primaryDeep}; }
  @media print { body { padding: 0; background: #fff; } .cta-btn, .stepper-ctl button { display: none; } details > *:not(summary) { display: block; } }
</style>
</head>
<body>
<div class="wrap">
  <header class="stack-2">
    <div class="brand"><h1>${s("title")}</h1>
      <p class="mute small">${s("generated", { date })}${report.portalId ? ` \xB7 ${s("portal", { id: esc(String(report.portalId)) })}` : ""}</p></div>
    <p class="mute">${s("description")}</p>
    <div class="badges">
      <span class="badge">${ICON.shield} ${s("readOnly")}</span>
      <span class="badge">${ICON.scan} ${s("local")}</span>
    </div>
  </header>

  ${main2}

  <footer>
    <p>${t("footer", { date })}</p>
    <p>${s("privacy")}</p>
    <p>${s("cleanup")}</p>
    <p>${s("cta")}</p>
    <a class="cta-btn" href="${CTA_URL}">${s("ctaLink")}</a>
    <p>${s("builtBy")} <a href="${CTA_URL}">Jipup</a> \xB7 CRM Health Check, report v${report.version}</p>
  </footer>
</div>

<script>
(function () {
  var cfg = ${JSON.stringify(impactConfig).replace(/</g, "\\u003c")};
  if (!document.getElementById("r-time")) return;
  var v = Object.assign({}, cfg.defaults);
  var nf = function (n) { return n.toLocaleString(cfg.locale); };
  var eur = function (n) { return n.toLocaleString(cfg.locale, { style: "currency", currency: "EUR", maximumFractionDigits: 0 }); };
  var pctFmt = new Intl.NumberFormat(cfg.locale, { style: "percent", maximumFractionDigits: 0 });
  var pct = function (r) { return pctFmt.format(r); };
  var rules = new Intl.PluralRules(cfg.locale);
  // Same subset of ICU as the renderer: {name} and {n, plural, ...} with #.
  function close(s, open) { var d = 0; for (var k = open; k < s.length; k++) { if (s[k] === "{") d++; else if (s[k] === "}" && --d === 0) return k; } return s.length - 1; }
  function hash(b, n) { var out = "", d = 0; for (var k = 0; k < b.length; k++) { var c = b[k]; if (c === "{") d++; if (c === "}") d--; out += c === "#" && d === 0 ? n : c; } return out; }
  function fill(tpl, vars) {
    var out = "", i = 0;
    while (i < tpl.length) {
      if (tpl[i] !== "{") { out += tpl[i++]; continue; }
      var end = close(tpl, i), body = tpl.slice(i + 1, end); i = end + 1;
      var m = /^\\s*(\\w+)\\s*,\\s*plural\\s*,([\\s\\S]*)$/.exec(body);
      if (!m) { var key = body.trim(); out += key in vars ? String(vars[key]) : "{" + key + "}"; continue; }
      var rest = m[2], opts = {}, j = 0;
      while (j < rest.length) {
        var sel = /^\\s*(=?\\w+)\\s*\\{/.exec(rest.slice(j)); if (!sel) break;
        var open = j + sel[0].length - 1, cl = close(rest, open);
        opts[sel[1]] = rest.slice(open + 1, cl); j = cl + 1;
      }
      var n = Number(vars[m[1]]);
      var br = opts["=" + n] != null ? opts["=" + n] : opts[rules.select(n)] != null ? opts[rules.select(n)] : opts.other;
      if (br != null) out += fill(hash(br, nf(n)), vars);
    }
    return out;
  }
  var duration = function (hours) {
    var minutes = Math.round(hours * 60);
    if (minutes < 60) return fill(cfg.strings.minutes, { n: nf(minutes) });
    return fill(cfg.strings.hours, { n: nf(hours >= 10 ? Math.round(hours) : Math.round(hours * 10) / 10) });
  };
  var $ = function (id) { return document.getElementById(id); };

  function recalc() {
    var ratio = cfg.totalContacts > 0 ? cfg.unusable / cfg.totalContacts : 0;
    var perMonth = v.contactsPerDay * 21;
    var deadEnds = perMonth * ratio;
    var perPerson = (deadEnds * v.minutesPerRecord) / 60;
    var hours = perPerson * v.headcount;
    var costPerYear = (hours / 151.67) * v.monthlyCost * 12;
    var departed = Math.round(v.customers * cfg.departureRate);
    var pipelineLost = departed * (v.winRate / 100) * v.averageDeal;

    $("r-time").textContent = duration(hours);
    $("r-time-unit").textContent = fill(cfg.strings.timeLostUnit, { headcount: v.headcount });
    $("r-time-cost").textContent = fill(cfg.strings.timeLostCost, { amount: eur(costPerYear), perPerson: duration(perPerson) });
    $("r-pipeline").textContent = eur(pipelineLost);
    $("r-fixed").textContent = eur(costPerYear + pipelineLost);
    $("how-time").textContent = fill(cfg.strings.howTimeLost, {
      unusable: nf(cfg.unusable), total: nf(cfg.totalContacts), ratio: pct(ratio),
      perDay: nf(v.contactsPerDay), perMonth: nf(Math.round(perMonth)), days: 21,
      deadEnds: nf(Math.round(deadEnds * 10) / 10), minutes: nf(v.minutesPerRecord),
      perPerson: duration(perPerson), headcount: nf(v.headcount),
      hours: duration(hours), monthlyCost: eur(v.monthlyCost), amount: eur(costPerYear) });
    $("how-pipeline").textContent = fill(cfg.strings.howPipelineLost, {
      departed: nf(departed), customers: nf(v.customers), rate: pct(cfg.departureRate),
      winRate: pct(v.winRate / 100), deal: eur(v.averageDeal), amount: eur(pipelineLost) });
    document.querySelectorAll("[data-input]").forEach(function (input) {
      if (document.activeElement !== input) input.value = nf(v[input.dataset.input]);
    });
  }

  document.querySelectorAll("[data-step]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var key = btn.dataset.for;
      var input = document.querySelector('[data-input="' + key + '"]');
      var min = Number(input.dataset.min), max = Number(input.dataset.max);
      v[key] = Math.min(max, Math.max(min, v[key] + Number(btn.dataset.step)));
      recalc();
    });
  });
  document.querySelectorAll("[data-input]").forEach(function (input) {
    input.addEventListener("change", function () {
      var raw = Number(String(input.value).replace(/[^0-9.,-]/g, "").replace(",", "."));
      var min = Number(input.dataset.min), max = Number(input.dataset.max);
      if (isFinite(raw)) v[input.dataset.input] = Math.min(max, Math.max(min, Math.round(raw)));
      recalc();
    });
  });
  recalc();
})();
</script>
</body>
</html>`;
}

// ../shared/common/src/lib/hubspot-oauth.ts
var HUBSPOT_OAUTH_BASE = "https://api.hubapi.com/oauth/2026-03";
var HubspotOAuthError = class extends Error {
  status;
  /** RFC 6749 error code (`invalid_grant`, `invalid_client`, …) when given. */
  error;
  constructor(status, body) {
    const fields = body && typeof body === "object" ? body : {};
    const error = typeof fields.error === "string" ? fields.error : null;
    const description = typeof fields.error_description === "string" ? fields.error_description : typeof fields.message === "string" ? fields.message : null;
    super(
      `HubSpot OAuth ${status}${error ? ` ${error}` : ""}${description ? `: ${description}` : ""}`
    );
    this.name = "HubspotOAuthError";
    this.status = status;
    this.error = error;
  }
};
async function postForm(path, fields) {
  const res = await fetch(`${HUBSPOT_OAUTH_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(fields)
  });
  const body = await res.json().catch(() => null);
  if (!res.ok) throw new HubspotOAuthError(res.status, body);
  return body;
}
async function introspectHubspotToken(token, credentials, tokenTypeHint = "access_token") {
  return postForm("/token/introspect", {
    client_id: credentials.clientId,
    client_secret: credentials.clientSecret,
    token_type_hint: tokenTypeHint,
    token
  });
}

// ../shared/common/src/lib/crm-fields.ts
var legal = (name, label, targetTypes = ["string"]) => ({
  object: "company",
  label,
  targetTypes,
  pending: [],
  writers: ["legal"],
  presets: { hubspot: { write: name, read: [name], provisioned: true } }
});
var LIST = ["string", "enumeration"];
var CRM_FIELDS = [
  {
    ...legal("jipup_siren", { fr: "SIREN", en: "SIREN" }),
    key: "company.siren",
    presets: { hubspot: { write: "jipup_siren", read: ["jipup_siren", "siren"], provisioned: true } }
  },
  {
    ...legal("jipup_siret_siege", { fr: "SIRET (si\xE8ge)", en: "SIRET (head office)" }),
    key: "company.siret",
    presets: { hubspot: { write: "jipup_siret_siege", read: ["jipup_siret_siege", "siret"], provisioned: true } }
  },
  { ...legal("jipup_code_ape", { fr: "Code APE / NAF", en: "APE / NAF code" }), key: "company.ape" },
  { ...legal("jipup_libelle_ape", { fr: "Activit\xE9 principale", en: "Main activity" }), key: "company.activity" },
  { ...legal("jipup_forme_juridique", { fr: "Forme juridique", en: "Legal form" }, LIST), key: "company.legalForm" },
  { ...legal("jipup_effectif_insee", { fr: "Effectif (INSEE)", en: "Headcount (INSEE)" }, LIST), key: "company.employeeRange" },
  { ...legal("jipup_categorie_entreprise", { fr: "Cat\xE9gorie d'entreprise", en: "Company category" }, LIST), key: "company.companyCategory" },
  { ...legal("jipup_date_creation", { fr: "Date de cr\xE9ation (INSEE)", en: "Incorporation date (INSEE)" }, ["date", "datetime"]), key: "company.incorporatedAt" },
  { ...legal("jipup_statut_insee", { fr: "Statut INSEE", en: "INSEE status" }, LIST), key: "company.legalStatus" },
  {
    key: "company.companyLinkedinUrl",
    object: "company",
    label: { fr: "Page LinkedIn", en: "LinkedIn page" },
    targetTypes: ["string"],
    pending: [],
    // Le job change, le reverse lookup et les nouvelles embauches l'écrivent sur
    // les sociétés qu'ils créent ou retrouvent.
    writers: ["company_enrichment", "job_change", "new_hire", "reverse_lookup", "tables"],
    presets: { hubspot: { write: "linkedin_company_page", read: ["linkedin_company_page", "hs_linkedin_handle"] } }
  },
  {
    key: "contact.linkedinProfileUrl",
    object: "contact",
    label: { fr: "URL LinkedIn", en: "LinkedIn URL" },
    targetTypes: ["string"],
    pending: [],
    writers: ["contact_enrichment", "job_change", "new_hire", "reverse_lookup", "tables"],
    presets: { hubspot: { write: "hs_linkedin_url", read: ["hs_linkedin_url"] } }
  },
  {
    // « phone » dans les Tables (CORE_HUBSPOT_WRITE) : c'est bien le mobile.
    key: "contact.mobilePhone",
    object: "contact",
    label: { fr: "Mobile", en: "Mobile" },
    targetTypes: ["string", "phone_number"],
    // Le job change, les nouvelles embauches et la récupération d'email (qui
    // reprend le scan du job change) décident de chercher un mobile sur sa valeur
    // et l'écrivent par la même livraison que l'enrichissement.
    pending: [],
    writers: ["contact_enrichment", "job_change", "new_hire", "tables"],
    presets: { hubspot: { write: "mobilephone", read: ["mobilephone"] } }
  }
  // Pas d'email : c'est la clé d'unicité des contacts HubSpot, l'adresse des emails
  // marketing et celle dont HubSpot suit les bounces. Jipup l'écrit toujours dans `email`.
];
function acceptsListTarget(def) {
  return def.targetTypes.includes("enumeration");
}
function readValueMap(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const out = {};
  for (const [k, v] of Object.entries(raw)) if (k && typeof v === "string" && v) out[k] = v;
  return out;
}
function present(v) {
  return typeof v === "string" ? v.trim() : "";
}
function createFieldResolver(input = {}) {
  const crm = input.crm ?? "hubspot";
  const defs = CRM_FIELDS;
  const known = input.properties ? new Map(input.properties.map((p) => [p.name, p])) : null;
  const defaultWrites = new Map(defs.map((d) => [d.presets[crm].write, d.key]));
  const rows = new Map(
    (input.mappings ?? []).filter((m) => m.status === "CONFIRMED").map((m) => [m.field, m])
  );
  const warnings = [];
  const writes = /* @__PURE__ */ new Map();
  const valueMaps = /* @__PURE__ */ new Map();
  const reads = /* @__PURE__ */ new Map();
  const taken = /* @__PURE__ */ new Map();
  for (const def of defs) {
    const row = rows.get(def.key);
    if (!row) continue;
    const preset = def.presets[crm];
    const warn = (property, reason) => warnings.push({ field: def.key, property, reason });
    const target = row.writeProperty;
    const prop2 = known?.get(target);
    let refused = null;
    const valueMap = readValueMap(row.valueMap);
    if (target !== preset.write) {
      if (known && !prop2) refused = "missing";
      else if (prop2?.readOnly) refused = "read_only";
      else if (prop2?.type && !def.targetTypes.includes(prop2.type)) refused = "incompatible_type";
      else if (prop2?.type === "enumeration" && !valueMap) refused = "incompatible_type";
      else if (taken.has(target) || defaultWrites.has(target)) refused = "conflict";
    }
    if (refused) warn(target, refused);
    else if (target !== preset.write) {
      writes.set(def.key, target);
      taken.set(target, def.key);
      if (valueMap && acceptsListTarget(def) && (!prop2 || prop2.type === "enumeration")) {
        const options = prop2?.options ? new Set(prop2.options) : null;
        valueMaps.set(
          def.key,
          Object.fromEntries(Object.entries(valueMap).filter(([, option]) => !options || options.has(option)))
        );
      }
    }
    const customReads = [];
    for (const name of [...row.readProperties, ...refused ? [] : [target]]) {
      const chosen = !refused && name === target && target !== preset.write;
      if (preset.read.includes(name) && !chosen || customReads.includes(name)) continue;
      if (known && !known.has(name)) {
        if (name !== target) warn(name, "missing");
        continue;
      }
      customReads.push(name);
    }
    if (customReads.length) reads.set(def.key, customReads);
  }
  const byDefault = (object, name) => defs.find((d) => d.object === object && d.presets[crm].write === name);
  return {
    warnings,
    resolveWrite: (field) => {
      const def = defs.find((d) => d.key === field);
      return writes.get(field) ?? def.presets[crm].write;
    },
    resolveRead: (field) => {
      const def = defs.find((d) => d.key === field);
      return [.../* @__PURE__ */ new Set([...reads.get(field) ?? [], ...def.presets[crm].read])];
    },
    customReadProperties: (object) => defs.filter((d) => d.object === object).flatMap((d) => reads.get(d.key) ?? []),
    readAlias: (object, name) => {
      const def = defs.find((d) => d.object === object && reads.get(d.key)?.includes(name));
      return def ? def.presets[crm].write : name;
    },
    translateName: (object, name) => {
      const def = byDefault(object, name);
      return (def && writes.get(def.key)) ?? name;
    },
    translateWrite: (object, props) => {
      const out = {};
      for (const [name, value] of Object.entries(props)) {
        const def = byDefault(object, name);
        const map = def && valueMaps.get(def.key);
        if (map && map[value] === void 0) continue;
        out[(def && writes.get(def.key)) ?? name] = map ? map[value] : value;
      }
      return out;
    },
    unmappedValues: (object, props) => Object.entries(props).flatMap(([name, value]) => {
      const def = byDefault(object, name);
      const map = def && valueMaps.get(def.key);
      return map && map[value] === void 0 ? [{ field: def.key, property: writes.get(def.key), value }] : [];
    }),
    overlayRead: (object, props) => {
      const out = { ...props };
      for (const def of defs) {
        if (def.object !== object) continue;
        const custom = reads.get(def.key);
        if (!custom) continue;
        const value = custom.map((name) => present(out[name])).find(Boolean);
        if (!value) continue;
        for (const name of def.presets[crm].read) out[name] = value;
      }
      return out;
    },
    customTargets: (object, props) => {
      const targets = new Set(
        defs.filter((d) => d.object === object).flatMap((d) => writes.get(d.key) ?? [])
      );
      return Object.keys(props).filter((name) => targets.has(name));
    }
  };
}

// ../shared/crm/src/credentials.ts
function crmHubspotCredentials() {
  const clientId = process.env.CRM_HUBSPOT_CLIENT_ID ?? process.env.NEXT_PUBLIC_HUBSPOT_CLIENT_ID ?? process.env.HUBSPOT_CLIENT_ID;
  const clientSecret = process.env.CRM_HUBSPOT_CLIENT_SECRET ?? process.env.HUBSPOT_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;
  return { clientId, clientSecret };
}

// ../shared/crm/src/adapters/hubspot/http.ts
var HUBSPOT_BASE = process.env.HUBSPOT_API_BASE ?? "https://api.hubapi.com";
var MAX_RETRIES = 5;
var MAX_BACKOFF_MS = 16e3;
function sleep(ms) {
  return new Promise((resolve2) => setTimeout(resolve2, ms));
}
function backoffMs(attempt, retryAfter) {
  const ra = retryAfter ? Number(retryAfter) : NaN;
  if (Number.isFinite(ra) && ra > 0) return Math.min(ra * 1e3, MAX_BACKOFF_MS);
  const base = Math.min(1e3 * 2 ** attempt, MAX_BACKOFF_MS);
  return base + Math.floor(Math.random() * 250);
}
async function hubspotFetch(url, init, token) {
  let attempt = 0;
  while (true) {
    const res = await fetch(url, {
      ...init,
      headers: {
        ...init.headers ?? {},
        Authorization: `Bearer ${token}`
      }
    });
    if (res.status !== 429 && res.status < 500) return res;
    if (attempt >= MAX_RETRIES) {
      console.log(`[hubspot] \u274C Failed after ${MAX_RETRIES + 1} attempts: ${res.status} on ${url.replace(/\?.*/, "")}`);
      return res;
    }
    const delay = backoffMs(attempt, res.headers.get("retry-after"));
    console.log(`[hubspot] \u26A0\uFE0F ${res.status} on ${url.replace(/\?.*/, "")}, retrying in ${delay}ms (attempt ${attempt + 1}/${MAX_RETRIES})...`);
    await sleep(delay);
    attempt++;
  }
}

// engine/email-domains.ts
var PERSONAL_EMAIL_DOMAINS = /* @__PURE__ */ new Set([
  // Test and placeholder domains.
  "example.com",
  "test.com",
  "localhost",
  // Webmails.
  "gmail.com",
  "googlemail.com",
  "yahoo.com",
  "yahoo.fr",
  "yahoo.co.uk",
  "yahoo.es",
  "yahoo.it",
  "ymail.com",
  "hotmail.com",
  "hotmail.fr",
  "hotmail.co.uk",
  "hotmail.be",
  "hotmail.es",
  "hotmail.it",
  "outlook.com",
  "outlook.fr",
  "live.com",
  "live.fr",
  "live.be",
  "msn.com",
  "msn.fr",
  "aol.com",
  "aol.fr",
  "icloud.com",
  "icloud.fr",
  "me.com",
  "mac.com",
  "proton.me",
  "protonmail.com",
  "pm.me",
  "gmx.com",
  "gmx.fr",
  "gmx.de",
  "gmx.net",
  "web.de",
  "mail.com",
  "zoho.com",
  "yandex.com",
  "yandex.ru",
  "libero.it",
  // French ISPs, past and present.
  "free.fr",
  "orange.fr",
  "wanadoo.fr",
  "laposte.net",
  "sfr.fr",
  "neuf.fr",
  "cegetel.net",
  "bbox.fr",
  "numericable.fr",
  "noos.fr",
  "club-internet.fr",
  "aliceadsl.fr",
  "voila.fr",
  "tiscali.fr",
  "libertysurf.fr",
  "nordnet.fr",
  // Other European ISPs.
  "skynet.be",
  "bluewin.ch",
  "t-online.de",
  // Disposable mailboxes.
  "yopmail.com",
  "yopmail.fr",
  "mailinator.com",
  "guerrillamail.com",
  "10minutemail.com",
  "temp-mail.org",
  "tempmail.com",
  "throwawaymail.com",
  "getnada.com",
  "maildrop.cc",
  "trashmail.com",
  "jetable.org"
]);
function emailDomain(email) {
  const s = String(email ?? "").trim();
  const at = s.lastIndexOf("@");
  return at < 0 ? "" : s.slice(at + 1).toLowerCase().replace(/^www\./, "");
}
function isPersonalEmailDomain(domain) {
  return PERSONAL_EMAIL_DOMAINS.has(String(domain ?? "").trim().toLowerCase().replace(/^www\./, ""));
}
var GENERIC_MAILBOXES = /* @__PURE__ */ new Set([
  "contact",
  "info",
  "hello",
  "bonjour",
  "sales",
  "commercial",
  "support",
  "help",
  "admin",
  "office",
  "team",
  "hr",
  "rh",
  "jobs",
  "recruitment",
  "billing",
  "compta",
  "facturation",
  "accueil",
  "direction",
  "marketing",
  "press",
  "presse",
  "partners",
  "partenaires",
  "webmaster",
  "postmaster",
  "abuse",
  "security",
  "privacy",
  "legal",
  "newsletter",
  "noreply",
  "no-reply",
  "donotreply",
  "do-not-reply",
  "notifications",
  "mailer-daemon"
]);
function isGenericEmail(email) {
  const mailbox = email.trim().toLowerCase().split("@")[0];
  if (!mailbox) return true;
  return GENERIC_MAILBOXES.has(mailbox) || /no[._-]?reply|not?[._-]?respond/.test(mailbox);
}

// engine/audit/constants.ts
var AUDIT_REPORT_VERSION = 17;
var NEW_RECORDS_WINDOW_DAYS = 30;
var UNTREATED_LEAD_MIN_DAYS = 7;
var UNTREATED_LEAD_MAX_DAYS = 90;
var HUBSPOT_BASE2 = "https://api.hubapi.com";
var PAGE_SIZE = 100;
var MAX_RECORDS_SCANNED = 2e5;
var SCHEMA_SAMPLE_SIZE = 2e3;
var SCHEMA_PROPS_PER_REQUEST = 80;
var GHOST_PROPERTY_FILL_RATIO = 0.03;
var PILLAR_WEIGHTS = {
  duplicates: 20,
  completeness: 20,
  quality: 15,
  structure: 10,
  freshness: 10,
  staleness: 10,
  deliverability: 5,
  pipeline: 5,
  schemaDebt: 5
};
var SCORE_CAP_CHECKS = /* @__PURE__ */ new Set([
  "deliverability.hardBounce",
  "deliverability.marketingWaste",
  "duplicates.contacts",
  "duplicates.companies",
  "quality.email.invalid"
]);
var SCORE_CAP_MAX = 69;
var CHAMPION_RANK_WEIGHT = 3;
var SEVERITY_RANK_WEIGHT = {
  ok: 1,
  warning: 2,
  critical: 3
};
var PROBLEM_RANK_WEIGHT = {
  missingPhone: 0.5,
  // A person who asked to be contacted and nobody did: each one is worth far
  // more than a cold record missing a field. At 2, a customer portal's 99 untreated
  // leads ranked 10th of 11 behind 9 087 incomplete companies and never
  // reached the cards; 30 puts them 5th (decided on 19/11/2026).
  untreatedLeads: 30,
  // Breaks segmentation and reports, loses no one: below the reachability gaps.
  unnormalizedCountries: 0.5
};
var PROBLEM_CARDS = 5;
var ALWAYS_SHOWN_WHEN_CRITICAL = /* @__PURE__ */ new Set(["untreatedLeads"]);
var SEVERITY_WARNING_RATIO = 0.15;
var SEVERITY_CRITICAL_RATIO = 0.35;
var ANNUAL_JOB_TURNOVER = 0.3;
var MONTHLY_JOB_TURNOVER = 1 - Math.pow(1 - ANNUAL_JOB_TURNOVER, 1 / 12);
var MAX_STALE_PROBABILITY = 0.85;
var GHOST_MIN_DELIVERIES = 10;
var STALE_MONTHS = 24;
var DORMANT_MONTHS = 12;
var ZOMBIE_DEAL_DAYS = 60;
var DEFAULT_EUROS_PER_CONTACT_PER_MONTH = 0.02;
var CHAMPION_WIN_RATE = 0.5;
var DEFAULT_AVERAGE_DEAL_EUROS = 1e4;
var CHAMPION_LIFECYCLE_STAGES = /* @__PURE__ */ new Set(["customer", "opportunity"]);
var INTAKE_WINDOW_MONTHS = 12;
var MIN_INTAKE_MONTHS = 3;
var MIN_WON_DEALS_FOR_AVERAGE = 5;
var CRITICAL_RATIO = {
  "quality.email.invalid": 0.1,
  "quality.email.typo": 0.05,
  "deliverability.hardBounce": 0.1,
  "deliverability.optout": 0.25,
  "deliverability.marketingWaste": 0.3,
  "duplicates.contacts": 0.3,
  "duplicates.companies": 0.3,
  "structure.owner.inactive": 0.2,
  // Version 14, outside the score (checks/unscored.ts): only the severity and
  // the ranking of their problems read these.
  "freshness.contact.untreatedLeads": 0.25,
  "structure.company.singleContactCustomers": 0.5,
  "quality.contact.country": 0.3,
  "quality.company.country": 0.3
};
var CONTACT_PROPERTIES = [
  "email",
  "firstname",
  "lastname",
  "phone",
  "mobilephone",
  "company",
  "associatedcompanyid",
  "website",
  "jobtitle",
  "country",
  "createdate",
  "lastmodifieddate",
  "lifecyclestage",
  "hs_lead_status",
  "num_associated_deals",
  "num_notes",
  "num_contacted_notes",
  "notes_last_updated",
  "notes_last_contacted",
  "hubspot_owner_id",
  "hs_linkedin_url",
  // Secondary addresses: the duplicate HubSpot cannot see on its own.
  "hs_additional_emails",
  "hs_email_optout",
  "hs_email_bounce",
  // The real hard-bounce property; the plain one is kept for older portals.
  "hs_email_hard_bounce_reason_enum",
  "hs_email_hard_bounce_reason",
  "hs_email_last_send_date",
  // Marketing email engagement, for ghost contacts.
  "hs_email_delivered",
  "hs_email_open",
  "hs_email_click",
  // Whether HubSpot bills this contact as a marketing contact. Read-only
  // through the API: the audit can count, never flip it.
  "hs_marketable_status",
  // Original source and its drill-downs: how the record entered the CRM
  // (sources.ts, version 14). `data_2` names the app of an integration.
  "hs_analytics_source",
  "hs_analytics_source_data_1",
  "hs_analytics_source_data_2"
];
var COMPANY_PROPERTIES = [
  "name",
  "domain",
  "website",
  // Secondary sites filed under the company (regional domains, old brands).
  "hs_additional_domains",
  "city",
  "country",
  "state",
  "zip",
  "industry",
  "numberofemployees",
  "annualrevenue",
  "founded_year",
  "linkedin_company_page",
  "hs_linkedin_handle",
  "createdate",
  "hs_lastmodifieddate",
  "num_associated_contacts",
  "num_associated_deals",
  // Revenue of the company's closed-won deals, rolled up by HubSpot itself:
  // readable with the companies scope alone, so the audit gets a customer's
  // value without asking for deals (scope dropped on 15/10/2026). Measured on
  // the test portal on 17/11/2026: filled a couple of minutes after the win.
  "total_revenue",
  "hubspot_owner_id",
  "phone",
  // Customer companies with a single contact (version 14), beside total_revenue.
  "lifecyclestage",
  // Original source and its drill-downs: how the record entered the CRM
  // (sources.ts, version 14). `data_2` names the app of an integration.
  "hs_analytics_source",
  "hs_analytics_source_data_1",
  "hs_analytics_source_data_2"
];
var DEAL_PROPERTIES = [
  "dealname",
  "dealstage",
  "pipeline",
  "amount",
  "closedate",
  "createdate",
  "hs_lastmodifieddate",
  "hs_is_closed",
  "hs_is_closed_won",
  "num_associated_contacts",
  "hubspot_owner_id",
  "notes_last_updated"
];
var ROLE_EMAIL_LOCALS = /* @__PURE__ */ new Set([
  "contact",
  "contacts",
  "info",
  "infos",
  "hello",
  "bonjour",
  "sales",
  "commercial",
  "support",
  "admin",
  "office",
  "team",
  "marketing",
  "accounting",
  "compta",
  "comptabilite",
  "facturation",
  "billing",
  "invoice",
  "rh",
  "hr",
  "recrutement",
  "jobs",
  "career",
  "careers",
  "press",
  "presse",
  "legal",
  "noreply",
  "no-reply",
  "donotreply",
  "postmaster",
  "webmaster",
  "abuse",
  "service",
  "help",
  "welcome",
  "newsletter",
  "direction"
]);
var FREE_EMAIL_DOMAINS = PERSONAL_EMAIL_DOMAINS;
var TYPO_DOMAINS = {
  "gmial.com": "gmail.com",
  "gmai.com": "gmail.com",
  "gmail.co": "gmail.com",
  "gmail.con": "gmail.com",
  "gmaill.com": "gmail.com",
  "gmail.fr": "gmail.com",
  "gnail.com": "gmail.com",
  "hotmial.com": "hotmail.com",
  "hotmai.com": "hotmail.com",
  "hotmail.con": "hotmail.com",
  "hotmil.com": "hotmail.com",
  "outlok.com": "outlook.com",
  "outloo.com": "outlook.com",
  "outlook.con": "outlook.com",
  "yahou.com": "yahoo.com",
  "yaho.com": "yahoo.com",
  "yahoo.con": "yahoo.com",
  "orange.com": "orange.fr",
  "wanadou.fr": "wanadoo.fr",
  "lapost.net": "laposte.net",
  "iclould.com": "icloud.com",
  "icloud.con": "icloud.com"
};
var MAX_FINDINGS_PER_CHECK = 12;

// engine/audit/types.ts
var CAPABILITY_SCOPES = {
  deals: "crm.objects.deals.read",
  owners: "crm.objects.owners.read",
  schemas: "crm.schemas.contacts.read"
};

// engine/audit/collect.ts
var OBJECTS = {
  contact: { path: "contacts", properties: CONTACT_PROPERTIES },
  company: { path: "companies", properties: COMPANY_PROPERTIES },
  deal: { path: "deals", properties: DEAL_PROPERTIES }
};
async function fetchTokenInfo(token) {
  if (!token.startsWith("pat-")) {
    const credentials = crmHubspotCredentials();
    if (!credentials) {
      console.warn("[audit] token introspection needs the OAuth client credentials; assuming optional scopes absent");
      return { portalId: null, scopes: [] };
    }
    try {
      const info = await introspectHubspotToken(token, credentials);
      return {
        portalId: info.hub_id != null ? String(info.hub_id) : null,
        scopes: Array.isArray(info.scopes) ? info.scopes : []
      };
    } catch (e) {
      const reason = e instanceof HubspotOAuthError ? e.status : e.message;
      console.warn(`[audit] token introspection \u2192 ${reason}; assuming optional scopes absent`);
      return { portalId: null, scopes: [] };
    }
  }
  const res = await hubspotFetch(
    `${HUBSPOT_BASE2}/oauth/v2/private-apps/get/access-token-info`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tokenKey: token })
    },
    token
  );
  if (!res.ok) {
    console.warn(`[audit] token introspection \u2192 ${res.status}; assuming optional scopes absent`);
    return { portalId: null, scopes: [] };
  }
  const data = await res.json();
  const hubId = data.hub_id ?? data.hubId;
  return {
    portalId: hubId != null ? String(hubId) : null,
    scopes: Array.isArray(data.scopes) ? data.scopes : []
  };
}
function capabilitiesFromScopes(scopes) {
  const granted = new Set(scopes);
  const caps = /* @__PURE__ */ new Set();
  for (const [capability, scope] of Object.entries(CAPABILITY_SCOPES)) {
    if (granted.has(scope)) caps.add(capability);
  }
  return caps;
}
async function fetchAllRecords(token, object, onPage, extraProperties = []) {
  const spec = OBJECTS[object];
  const properties = [.../* @__PURE__ */ new Set([...spec.properties, ...extraProperties])];
  const records = [];
  let after = null;
  while (true) {
    const url = `${HUBSPOT_BASE2}/crm/v3/objects/${spec.path}?limit=${PAGE_SIZE}&archived=false&properties=${properties.join(",")}` + (after ? `&after=${encodeURIComponent(after)}` : "");
    const res = await hubspotFetch(url, { method: "GET" }, token);
    if (!res.ok) {
      throw new Error(`HubSpot list ${spec.path} \u2192 ${res.status}`);
    }
    const data = await res.json();
    for (const r of data.results ?? []) records.push(r);
    await onPage?.(records.length);
    if (records.length >= MAX_RECORDS_SCANNED) {
      console.warn(
        `[audit] cap of ${MAX_RECORDS_SCANNED} ${spec.path} reached \u2014 the portal holds more.`
      );
      return { records, capped: true };
    }
    after = data.paging?.next?.after ?? null;
    if (!after) break;
  }
  return { records, capped: false };
}
function fallbackCatalog(object) {
  return { names: new Set(OBJECTS[object].properties), custom: [] };
}
async function fetchPropertyCatalog(token, object) {
  const res = await hubspotFetch(
    `${HUBSPOT_BASE2}/crm/v3/properties/${OBJECTS[object].path}`,
    { method: "GET" },
    token
  );
  if (!res.ok) {
    console.warn(
      `[audit] ${object} properties \u2192 ${res.status}; falling back to standard HubSpot fields`
    );
    return fallbackCatalog(object);
  }
  const data = await res.json();
  const names = /* @__PURE__ */ new Set();
  const custom = [];
  const requested = new Set(OBJECTS[object].properties);
  for (const p of data.results ?? []) {
    if (!p?.name) continue;
    if (p.hidden && !(p.hubspotDefined !== false && requested.has(p.name))) continue;
    names.add(p.name);
    if (p.hubspotDefined === false && !p.calculated) custom.push(p.name);
  }
  if (names.size === 0) {
    console.warn(`[audit] empty ${object} catalog; falling back to standard HubSpot fields`);
    return fallbackCatalog(object);
  }
  custom.sort();
  return { names, custom };
}
async function fetchActiveOwnerIds(token) {
  const ids = /* @__PURE__ */ new Set();
  let after = null;
  while (true) {
    const url = `${HUBSPOT_BASE2}/crm/v3/owners?limit=100&archived=false` + (after ? `&after=${encodeURIComponent(after)}` : "");
    const res = await hubspotFetch(url, { method: "GET" }, token);
    if (!res.ok) {
      console.warn(`[audit] owners \u2192 ${res.status}`);
      return null;
    }
    const data = await res.json();
    for (const o of data.results ?? []) if (o?.id) ids.add(String(o.id));
    after = data.paging?.next?.after ?? null;
    if (!after) break;
  }
  return ids;
}
async function fetchSchemaSample(token, customContactProps) {
  if (customContactProps.length === 0) return [];
  const merged = /* @__PURE__ */ new Map();
  for (let i = 0; i < customContactProps.length; i += SCHEMA_PROPS_PER_REQUEST) {
    const chunk = customContactProps.slice(i, i + SCHEMA_PROPS_PER_REQUEST);
    let after = null;
    let loaded = 0;
    while (loaded < SCHEMA_SAMPLE_SIZE) {
      const url = `${HUBSPOT_BASE2}/crm/v3/objects/contacts?limit=${PAGE_SIZE}&archived=false&properties=${chunk.join(",")}` + (after ? `&after=${encodeURIComponent(after)}` : "");
      const res = await hubspotFetch(url, { method: "GET" }, token);
      if (!res.ok) {
        console.warn(`[audit] schema sample \u2192 ${res.status}`);
        break;
      }
      const data = await res.json();
      for (const rec of data.results ?? []) {
        const existing = merged.get(rec.id);
        if (existing) {
          existing.properties = { ...existing.properties, ...rec.properties };
        } else {
          merged.set(rec.id, { id: rec.id, properties: { ...rec.properties } });
        }
        loaded++;
      }
      after = data.paging?.next?.after ?? null;
      if (!after) break;
    }
  }
  return [...merged.values()];
}
async function collectAuditContext(token, now, onProgress, fields = createFieldResolver()) {
  await onProgress(2, "connection");
  const { portalId, scopes } = await fetchTokenInfo(token);
  const capabilities = capabilitiesFromScopes(scopes);
  await onProgress(5, "properties");
  const [contactCatalog, companyCatalog, dealCatalog] = await Promise.all([
    fetchPropertyCatalog(token, "contact"),
    fetchPropertyCatalog(token, "company"),
    capabilities.has("deals") ? fetchPropertyCatalog(token, "deal") : Promise.resolve({ names: /* @__PURE__ */ new Set(), custom: [] })
  ]);
  await onProgress(8, "contacts");
  const contacts = await fetchAllRecords(token, "contact", async (loaded) => {
    await onProgress(Math.min(44, 8 + Math.floor(loaded / 1e3)), "contacts");
  }, fields.customReadProperties("contact"));
  for (const r of contacts.records) r.properties = fields.overlayRead("contact", r.properties ?? {});
  await onProgress(45, "companies");
  const companies = await fetchAllRecords(token, "company", async (loaded) => {
    await onProgress(Math.min(63, 45 + Math.floor(loaded / 1e3)), "companies");
  }, fields.customReadProperties("company"));
  for (const r of companies.records) r.properties = fields.overlayRead("company", r.properties ?? {});
  let deals = { records: [], capped: false };
  if (capabilities.has("deals")) {
    await onProgress(65, "deals");
    deals = await fetchAllRecords(token, "deal", async (loaded) => {
      await onProgress(Math.min(73, 65 + Math.floor(loaded / 1e3)), "deals");
    });
  }
  let activeOwnerIds = null;
  if (capabilities.has("owners")) {
    await onProgress(75, "owners");
    activeOwnerIds = await fetchActiveOwnerIds(token);
  }
  let schemaSample = [];
  if (capabilities.has("schemas")) {
    await onProgress(78, "schema");
    schemaSample = await fetchSchemaSample(token, contactCatalog.custom);
  }
  await onProgress(88, "analysis");
  const context = {
    now,
    portalId,
    contacts: contacts.records,
    companies: companies.records,
    deals: deals.records,
    activeOwnerIds,
    contactProps: contactCatalog.names,
    companyProps: companyCatalog.names,
    dealProps: dealCatalog.names,
    customContactProps: contactCatalog.custom,
    customCompanyProps: companyCatalog.custom,
    schemaSample,
    capabilities,
    scan: {
      contacts: contacts.records.length,
      companies: companies.records.length,
      deals: deals.records.length,
      contactsCapped: contacts.capped,
      companiesCapped: companies.capped,
      dealsCapped: deals.capped
    }
  };
  return { context, scopes };
}

// engine/audit/field.ts
function str(v) {
  return v == null ? "" : String(v).trim();
}
function prop(rec, name) {
  return str(rec.properties?.[name]);
}
function filled(rec, name) {
  return prop(rec, name).length > 0;
}
function firstFilled(rec, ...names) {
  for (const n of names) {
    const v = prop(rec, n);
    if (v) return v;
  }
  return "";
}
function num(rec, name) {
  const v = Number(prop(rec, name));
  return Number.isFinite(v) ? v : 0;
}
function bool(rec, name) {
  const v = prop(rec, name).toLowerCase();
  return v === "true" || v === "yes" || v === "1";
}
function parseDate(v) {
  const s = str(v);
  if (!s) return null;
  if (/^\d+$/.test(s)) {
    const n = Number(s);
    return Number.isFinite(n) && n > 0 ? n : null;
  }
  const t = Date.parse(s);
  return Number.isNaN(t) ? null : t;
}
function dateProp(rec, name) {
  return parseDate(rec.properties?.[name]);
}
var MS_PER_DAY = 864e5;
var MS_PER_MONTH = MS_PER_DAY * 30.44;
function daysSince(ts, now) {
  return (now - ts) / MS_PER_DAY;
}
function monthsSince(ts, now) {
  return (now - ts) / MS_PER_MONTH;
}
function emailLocal(email) {
  const at = email.indexOf("@");
  return at > 0 ? email.slice(0, at).toLowerCase() : "";
}
function emailDomain2(email) {
  const at = email.indexOf("@");
  return at > 0 ? email.slice(at + 1).toLowerCase() : "";
}
function isStructurallyInvalidEmail(email) {
  if (!email) return false;
  if (/\s/.test(email)) return true;
  const parts = email.split("@");
  if (parts.length !== 2) return true;
  const [local, domain] = parts;
  if (!local || !domain) return true;
  if (!domain.includes(".")) return true;
  if (/^[.-]|[.-]$/.test(domain)) return true;
  if (domain.includes("..")) return true;
  if (!/^[a-z0-9.-]+$/i.test(domain)) return true;
  if (!/\.[a-z]{2,}$/i.test(domain)) return true;
  return false;
}
function isPlausiblePhone(raw) {
  if (!raw) return false;
  if (/[a-z]/i.test(raw)) return false;
  const digits = raw.replace(/\D+/g, "");
  return digits.length >= 8 && digits.length <= 15;
}
function hasBadCasing(name) {
  const letters = name.replace(/[^\p{L}]/gu, "");
  if (letters.length < 2) return false;
  return letters === letters.toUpperCase() || letters === letters.toLowerCase();
}
function contactName(rec) {
  const n = `${prop(rec, "firstname")} ${prop(rec, "lastname")}`.trim();
  return n || prop(rec, "email") || null;
}
function companyName(rec) {
  return prop(rec, "name") || prop(rec, "domain") || null;
}
function dealName(rec) {
  return prop(rec, "dealname") || null;
}
function nameOf(rec, object) {
  if (object === "contact") return contactName(rec);
  if (object === "company") return companyName(rec);
  return dealName(rec);
}
var RECORD_PATH = {
  contact: "contact",
  company: "record/0-2",
  deal: "record/0-3"
};
function hubspotUrl(portalId, object, id) {
  if (!portalId) return null;
  return `https://app.hubspot.com/contacts/${portalId}/${RECORD_PATH[object]}/${id}`;
}
function scoreFromRatio(ratio, criticalRatio) {
  if (criticalRatio <= 0) return ratio > 0 ? 0 : 100;
  const normalized = Math.min(1, ratio / criticalRatio);
  return Math.round(100 * (1 - normalized));
}
function severityFromNormalized(normalized) {
  if (normalized >= SEVERITY_CRITICAL_RATIO) return "critical";
  if (normalized >= SEVERITY_WARNING_RATIO) return "warning";
  return "ok";
}
function buildCheck(params) {
  const { id, affected, total } = params;
  const weight = params.weight ?? 1;
  if (total <= 0) {
    return {
      id,
      affected: 0,
      total: 0,
      ratio: 0,
      score: null,
      weight,
      severity: "ok",
      skipped: "no_data",
      ...params.meta ? { meta: params.meta } : {}
    };
  }
  const ratio = affected / total;
  const criticalRatio = CRITICAL_RATIO[id] ?? 1;
  const normalized = Math.min(1, ratio / criticalRatio);
  return {
    id,
    affected,
    total,
    ratio,
    score: scoreFromRatio(ratio, criticalRatio),
    weight,
    severity: severityFromNormalized(normalized),
    ...params.sampled ? { sampled: true, sampleSize: params.sampleSize } : {},
    ...params.meta ? { meta: params.meta } : {}
  };
}
function skippedCheck(id, reason, weight = 1) {
  return {
    id,
    affected: 0,
    total: 0,
    ratio: 0,
    score: null,
    weight,
    severity: "ok",
    skipped: reason
  };
}
var EvidenceCollector = class {
  counts = /* @__PURE__ */ new Map();
  findings = [];
  add(checkId, object, rec, detail) {
    const seen = this.counts.get(checkId) ?? 0;
    if (seen >= MAX_FINDINGS_PER_CHECK) return;
    this.counts.set(checkId, seen + 1);
    this.findings.push({
      checkId,
      objectType: object,
      objectId: rec.id,
      objectName: nameOf(rec, object),
      ...detail ? { detail } : {}
    });
  }
  /** Evidence for a synthetic row that is not a single CRM record. */
  addRaw(finding) {
    const seen = this.counts.get(finding.checkId) ?? 0;
    if (seen >= MAX_FINDINGS_PER_CHECK) return;
    this.counts.set(finding.checkId, seen + 1);
    this.findings.push(finding);
  }
};

// engine/audit/checks/freshness.ts
function lastActivityAt(rec, ctx) {
  const candidates = ["notes_last_contacted", "notes_last_updated", "hs_email_last_send_date"].filter((p) => ctx.contactProps.has(p)).map((p) => dateProp(rec, p)).filter((t) => t !== null);
  return candidates.length > 0 ? Math.max(...candidates) : null;
}
function canSeeActivity(ctx) {
  return ctx.contactProps.has("notes_last_contacted") || ctx.contactProps.has("notes_last_updated");
}
function runFreshness(ctx, ev) {
  const checks = [];
  if (!canSeeActivity(ctx)) {
    checks.push(
      skippedCheck("freshness.contact.neverContacted", "missing_property", 3),
      skippedCheck("freshness.contact.dormant", "missing_property", 2)
    );
  } else {
    let neverContacted = 0;
    let dormant = 0;
    let contactable = 0;
    for (const rec of ctx.contacts) {
      const last = lastActivityAt(rec, ctx);
      if (last === null) {
        neverContacted++;
        ev.add("freshness.contact.neverContacted", "contact", rec);
        continue;
      }
      contactable++;
      const months = monthsSince(last, ctx.now);
      if (months >= DORMANT_MONTHS) {
        dormant++;
        ev.add("freshness.contact.dormant", "contact", rec, {
          lastActivity: new Date(last).toISOString(),
          monthsSince: Math.round(months)
        });
      }
    }
    checks.push(
      buildCheck({
        id: "freshness.contact.neverContacted",
        affected: neverContacted,
        total: ctx.contacts.length,
        weight: 3
      }),
      buildCheck({
        id: "freshness.contact.dormant",
        affected: dormant,
        total: contactable,
        weight: 2,
        meta: { months: DORMANT_MONTHS }
      })
    );
  }
  if (ctx.contactProps.has("createdate") && ctx.contactProps.has("lastmodifieddate")) {
    let untouched = 0;
    let dated = 0;
    for (const rec of ctx.contacts) {
      const created = dateProp(rec, "createdate");
      const modified = dateProp(rec, "lastmodifieddate");
      if (created === null || modified === null) continue;
      dated++;
      const ageMonths = monthsSince(created, ctx.now);
      const editedWindowDays = (modified - created) / 864e5;
      if (ageMonths >= DORMANT_MONTHS && editedWindowDays <= 1) {
        untouched++;
        ev.add("freshness.contact.neverEdited", "contact", rec, {
          created: new Date(created).toISOString(),
          ageMonths: Math.round(ageMonths)
        });
      }
    }
    checks.push(
      buildCheck({
        id: "freshness.contact.neverEdited",
        affected: untouched,
        total: dated,
        weight: 2
      })
    );
  } else {
    checks.push(skippedCheck("freshness.contact.neverEdited", "missing_property", 2));
  }
  if (ctx.contactProps.has("lifecyclestage") && ctx.contactProps.has("num_associated_deals")) {
    let inconsistent = 0;
    let customers = 0;
    for (const rec of ctx.contacts) {
      const stage = (rec.properties?.lifecyclestage ?? "").toString().toLowerCase();
      if (stage !== "customer") continue;
      customers++;
      if (Number(rec.properties?.num_associated_deals ?? 0) > 0) continue;
      inconsistent++;
      ev.add("freshness.contact.customerWithoutDeal", "contact", rec, { stage });
    }
    checks.push(
      buildCheck({
        id: "freshness.contact.customerWithoutDeal",
        affected: inconsistent,
        total: customers,
        weight: 1
      })
    );
  } else {
    checks.push(skippedCheck("freshness.contact.customerWithoutDeal", "missing_property", 1));
  }
  return { checks, findings: [] };
}

// engine/audit/distributions.ts
var ACTIVITY_BUCKETS = [
  { id: "lt3", maxMonths: 3 },
  { id: "m3to6", maxMonths: 6 },
  { id: "m6to12", maxMonths: 12 },
  { id: "m12to24", maxMonths: 24 },
  { id: "gt24", maxMonths: Infinity }
];
function bucketFor(months) {
  for (const b of ACTIVITY_BUCKETS) {
    if (months < b.maxMonths) return b.id;
  }
  return "gt24";
}
function contactActivity(ctx) {
  if (!canSeeActivity(ctx) || ctx.contacts.length === 0) return null;
  const counts = new Map(
    [...ACTIVITY_BUCKETS.map((b) => b.id), "never"].map((id) => [id, 0])
  );
  let activeLast12Months = 0;
  for (const rec of ctx.contacts) {
    const last = lastActivityAt(rec, ctx);
    if (last === null) {
      counts.set("never", (counts.get("never") ?? 0) + 1);
      continue;
    }
    const months = Math.max(0, monthsSince(last, ctx.now));
    if (months < DORMANT_MONTHS) activeLast12Months++;
    const id = bucketFor(months);
    counts.set(id, (counts.get(id) ?? 0) + 1);
  }
  return {
    buckets: [...counts.entries()].map(([id, contacts]) => ({ id, contacts })),
    total: ctx.contacts.length,
    activeLast12Months
  };
}
function lifecycle(ctx) {
  if (!ctx.contactProps.has("lifecyclestage")) return null;
  const counts = /* @__PURE__ */ new Map();
  for (const rec of ctx.contacts) {
    const raw = (rec.properties?.lifecyclestage ?? "").toString().trim().toLowerCase();
    const key = raw || "unknown";
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  if (counts.size === 1 && counts.has("unknown")) return null;
  return [...counts.entries()].map(([stage, contacts]) => ({ stage, contacts })).sort((a, b) => b.contacts - a.contacts);
}
function buildDistributions(ctx) {
  return {
    contactActivity: contactActivity(ctx),
    lifecycle: lifecycle(ctx)
  };
}

// engine/audit/checks/completeness.ts
var CONTACT_FIELDS = [
  { key: "email", properties: ["email"], weight: 3 },
  { key: "name", properties: ["firstname"], weight: 2 },
  { key: "lastname", properties: ["lastname"], weight: 2 },
  { key: "phone", properties: ["phone", "mobilephone"], weight: 2 },
  { key: "linkedin", properties: ["hs_linkedin_url"], weight: 2 },
  { key: "jobtitle", properties: ["jobtitle"], weight: 2 },
  { key: "company", properties: ["company", "associatedcompanyid"], weight: 1 }
];
var COMPANY_FIELDS = [
  // Without a domain a company cannot be deduplicated, enriched or matched to
  // an account — it is the single most structural gap on the company object.
  { key: "domain", properties: ["domain", "website"], weight: 3 },
  { key: "name", properties: ["name"], weight: 2 },
  { key: "industry", properties: ["industry"], weight: 2 },
  { key: "size", properties: ["numberofemployees"], weight: 2 },
  { key: "location", properties: ["city", "country"], weight: 1 },
  { key: "linkedin", properties: ["linkedin_company_page", "hs_linkedin_handle"], weight: 1 }
];
function runFields(object, fields, records, available, ev) {
  return fields.map((field) => {
    const id = `completeness.${object}.${field.key}`;
    const usable = field.properties.filter((p) => available.has(p));
    if (usable.length === 0) return skippedCheck(id, "missing_property", field.weight);
    let affected = 0;
    for (const rec of records) {
      if (usable.some((p) => filled(rec, p))) continue;
      affected++;
      ev.add(id, object, rec, { missing: field.properties });
    }
    return buildCheck({ id, affected, total: records.length, weight: field.weight });
  });
}
function runCompleteness(ctx, ev) {
  return {
    checks: [
      ...runFields("contact", CONTACT_FIELDS, ctx.contacts, ctx.contactProps, ev),
      ...runFields("company", COMPANY_FIELDS, ctx.companies, ctx.companyProps, ev)
    ],
    findings: []
  };
}

// engine/audit/checks/deliverability.ts
var HARD_BOUNCE_REASON_PROPS = [
  "hs_email_hard_bounce_reason_enum",
  "hs_email_hard_bounce_reason"
];
function runDeliverability(ctx, ev) {
  const checks = [];
  const hasEmail = ctx.contactProps.has("email");
  const reasonProps = HARD_BOUNCE_REASON_PROPS.filter((p) => ctx.contactProps.has(p));
  const useBounceCounter = reasonProps.length === 0 && ctx.contactProps.has("hs_email_bounce");
  const hardBouncedIds = /* @__PURE__ */ new Set();
  const optedOutIds = /* @__PURE__ */ new Set();
  const ghostIds = /* @__PURE__ */ new Set();
  if (!hasEmail || reasonProps.length === 0 && !useBounceCounter) {
    checks.push(skippedCheck("deliverability.hardBounce", "missing_property", 3));
  } else {
    let mailable = 0;
    for (const rec of ctx.contacts) {
      if (!filled(rec, "email")) continue;
      mailable++;
      const reason = firstFilled(rec, ...reasonProps);
      const bounces = num(rec, "hs_email_bounce");
      if (useBounceCounter ? bounces <= 0 : !reason) continue;
      hardBouncedIds.add(rec.id);
      ev.add("deliverability.hardBounce", "contact", rec, {
        email: prop(rec, "email"),
        reason: reason || null,
        bounces
      });
    }
    checks.push(
      buildCheck({
        id: "deliverability.hardBounce",
        affected: hardBouncedIds.size,
        total: mailable,
        weight: 3
      })
    );
  }
  if (!hasEmail || !ctx.contactProps.has("hs_email_optout")) {
    checks.push(skippedCheck("deliverability.optout", "missing_property", 2));
  } else {
    let mailable = 0;
    for (const rec of ctx.contacts) {
      if (!filled(rec, "email")) continue;
      mailable++;
      if (!bool(rec, "hs_email_optout")) continue;
      optedOutIds.add(rec.id);
      ev.add("deliverability.optout", "contact", rec, { email: prop(rec, "email") });
    }
    checks.push(
      buildCheck({
        id: "deliverability.optout",
        affected: optedOutIds.size,
        total: mailable,
        weight: 2
      })
    );
  }
  const phoneProps = ["phone", "mobilephone"].filter((p) => ctx.contactProps.has(p));
  if (!hasEmail && phoneProps.length === 0) {
    checks.push(skippedCheck("deliverability.unreachable", "missing_property", 2));
  } else {
    let unreachable = 0;
    for (const rec of ctx.contacts) {
      const hasUsableEmail2 = hasEmail && filled(rec, "email") && !hardBouncedIds.has(rec.id);
      const hasPhone = phoneProps.some((p) => filled(rec, p));
      if (hasUsableEmail2 || hasPhone) continue;
      unreachable++;
      ev.add("deliverability.unreachable", "contact", rec);
    }
    checks.push(
      buildCheck({
        id: "deliverability.unreachable",
        affected: unreachable,
        total: ctx.contacts.length,
        weight: 2
      })
    );
  }
  const hasEngagement = ctx.contactProps.has("hs_email_delivered") && ctx.contactProps.has("hs_email_open");
  if (!hasEmail || !hasEngagement) {
    checks.push(skippedCheck("deliverability.ghost", "missing_property", 2));
  } else {
    let delivered = 0;
    for (const rec of ctx.contacts) {
      if (!filled(rec, "email") || hardBouncedIds.has(rec.id)) continue;
      const sent = num(rec, "hs_email_delivered");
      if (sent <= 0) continue;
      delivered++;
      if (sent < GHOST_MIN_DELIVERIES) continue;
      if (num(rec, "hs_email_open") > 0 || num(rec, "hs_email_click") > 0) continue;
      ghostIds.add(rec.id);
      ev.add("deliverability.ghost", "contact", rec, {
        email: prop(rec, "email"),
        delivered: sent
      });
    }
    checks.push(
      buildCheck({
        id: "deliverability.ghost",
        affected: ghostIds.size,
        total: delivered,
        weight: 2,
        meta: { minDeliveries: GHOST_MIN_DELIVERIES }
      })
    );
  }
  let marketingIds = null;
  if (!ctx.contactProps.has("hs_marketable_status")) {
    checks.push(skippedCheck("deliverability.marketingWaste", "missing_property", 2));
  } else {
    marketingIds = /* @__PURE__ */ new Set();
    const wasted = { hardBounced: 0, optedOut: 0, ghost: 0 };
    for (const rec of ctx.contacts) {
      if (!bool(rec, "hs_marketable_status")) continue;
      marketingIds.add(rec.id);
      const cause = hardBouncedIds.has(rec.id) ? "hardBounced" : optedOutIds.has(rec.id) ? "optedOut" : ghostIds.has(rec.id) ? "ghost" : null;
      if (!cause) continue;
      wasted[cause]++;
      ev.add("deliverability.marketingWaste", "contact", rec, {
        email: prop(rec, "email"),
        cause
      });
    }
    checks.push(
      buildCheck({
        id: "deliverability.marketingWaste",
        affected: wasted.hardBounced + wasted.optedOut + wasted.ghost,
        total: marketingIds.size,
        weight: 2,
        meta: { ...wasted, minDeliveries: GHOST_MIN_DELIVERIES }
      })
    );
  }
  return {
    checks,
    findings: [],
    totals: { hardBouncedIds, optedOutIds, ghostIds, marketingIds }
  };
}

// engine/duplicate-explanation.ts
function customReasonEn(effect, label) {
  return effect === "identifier" || effect === "bonus" ? `customer rule: same "${label}"` : `customer rule: different "${label}"`;
}
var REASON_EN = {
  same_linkedin: "same LinkedIn URL",
  same_email: "same email",
  same_email_secondary: "same email (secondary address on one side)",
  same_mobile: "same mobile phone",
  same_name_phone: "same full name + same phone",
  same_phone_name_missing: "same phone (name missing on one side)",
  same_name_company: "same full name + same company",
  same_name_email_domain: "same full name + same email domain root",
  same_name_only: "same full name (no corroboration)",
  exact_fuzzy_name: "exact + fuzzy name",
  fuzzy_full_name: "fuzzy full name",
  swapped_name: "same name (first/last swapped)",
  same_email_local: "same email local part, different domain",
  near_email_local: "near-identical email local part + same domain root",
  same_siren: "same SIREN (legal identifier)",
  same_domain: "same exact domain",
  same_linkedin_corroborated: "same LinkedIn + name/domain corroboration",
  same_linkedin_alone: "same LinkedIn (uncorroborated -> manual review)",
  same_name_domain_root: "same name + same domain root",
  same_domain_root_other_tld: "same domain root, different TLD",
  same_name_city: "same name + same city",
  fuzzy_name_same_domain: "fuzzy name + same exact domain",
  ghost_domain_root: "ghost record (missing name) + same domain root",
  same_name_no_domain_one_side: "same name + one side has no domain",
  fuzzy_name_no_domain_one_side: "fuzzy name + one side has no domain",
  same_name_different_roots: "same name + different domain roots",
  fuzzy_name_fuzzy_root: "fuzzy name + fuzzy domain root"
};
var CORROBORATION_EN = {
  same_company: "same company",
  similar_company: "similar company",
  same_associated_company: "same associated company",
  same_email_domain_root: "same email domain root",
  same_phone: "same phone",
  none: "no corroboration"
};
function EVIDENCE_REASON_EN(code, corroboration) {
  const base = REASON_EN[code];
  return code === "exact_fuzzy_name" || code === "fuzzy_full_name" ? `${base} (${CORROBORATION_EN[corroboration ?? "none"]})` : base;
}
var REASON_TO_CODE = /* @__PURE__ */ new Map();
for (const code of Object.keys(REASON_EN)) {
  if (code === "exact_fuzzy_name" || code === "fuzzy_full_name") {
    for (const w of Object.keys(CORROBORATION_EN)) {
      REASON_TO_CODE.set(EVIDENCE_REASON_EN(code, w), { code, with: w });
    }
  } else REASON_TO_CODE.set(REASON_EN[code], { code });
}

// engine/duplicate-normalizers.ts
function stripAccents(s) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "");
}
function str2(v) {
  return v == null ? "" : String(v).trim();
}
function levenshtein(a, b, maxDist) {
  if (a === b) return 0;
  if (Math.abs(a.length - b.length) > maxDist) return maxDist + 1;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    let rowMin = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
      if (cur[j] < rowMin) rowMin = cur[j];
    }
    if (rowMin > maxDist) return maxDist + 1;
    prev = cur;
  }
  return prev[b.length];
}
function oneSlipApart(a, b) {
  if (levenshtein(a, b, 1) <= 1) return true;
  if (a.length !== b.length) return false;
  let i = 0;
  while (i < a.length && a[i] === b[i]) i++;
  if (i >= a.length - 1) return false;
  return a[i] === b[i + 1] && a[i + 1] === b[i] && a.slice(i + 2) === b.slice(i + 2);
}
function words(v) {
  return stripAccents(str2(v)).toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").replace(/\s+/g, " ").trim();
}
var COUNTRY_NAMES = {
  FR: ["france", "frankreich", "francia", "republique francaise", "french republic", "fra"],
  DE: ["germany", "allemagne", "deutschland", "alemania", "germania", "deu", "ger"],
  GB: ["united kingdom", "uk", "great britain", "britain", "royaume uni", "angleterre", "england", "scotland", "wales", "northern ireland", "gbr"],
  US: ["united states", "united states of america", "usa", "u s a", "u s", "etats unis", "etats unis d amerique", "america", "estados unidos", "vereinigte staaten"],
  ES: ["spain", "espagne", "espana", "spanien", "esp"],
  IT: ["italy", "italie", "italia", "italien", "ita"],
  BE: ["belgium", "belgique", "belgie", "belgien", "bel"],
  CH: ["switzerland", "suisse", "schweiz", "svizzera", "che"],
  NL: ["netherlands", "the netherlands", "pays bas", "nederland", "holland", "hollande", "niederlande", "nld"],
  LU: ["luxembourg", "luxemburg", "lux"],
  PT: ["portugal", "prt"],
  AT: ["austria", "autriche", "osterreich", "aut"],
  IE: ["ireland", "irlande", "eire", "irl"],
  CA: ["canada", "kanada", "can"],
  AU: ["australia", "australie", "australien", "aus"],
  NZ: ["new zealand", "nouvelle zelande", "nzl"],
  SE: ["sweden", "suede", "sverige", "schweden", "swe"],
  NO: ["norway", "norvege", "norge", "norwegen", "nor"],
  DK: ["denmark", "danemark", "danmark", "danemark", "dnk"],
  FI: ["finland", "finlande", "suomi", "fin"],
  PL: ["poland", "pologne", "polska", "polen", "pol"],
  CZ: ["czech republic", "czechia", "republique tcheque", "tchequie", "cesko", "cze"],
  HU: ["hungary", "hongrie", "magyarorszag", "hun"],
  RO: ["romania", "roumanie", "rou"],
  GR: ["greece", "grece", "grc"],
  TR: ["turkey", "turkiye", "turquie", "tur"],
  MA: ["morocco", "maroc", "mar"],
  TN: ["tunisia", "tunisie", "tun"],
  DZ: ["algeria", "algerie", "dza"],
  SN: ["senegal", "sen"],
  CI: ["ivory coast", "cote d ivoire", "civ"],
  CM: ["cameroon", "cameroun", "cmr"],
  EG: ["egypt", "egypte", "egy"],
  ZA: ["south africa", "afrique du sud", "zaf"],
  BR: ["brazil", "bresil", "brasil", "bra"],
  MX: ["mexico", "mexique", "mex"],
  AR: ["argentina", "argentine", "arg"],
  CL: ["chile", "chili", "chl"],
  CO: ["colombia", "colombie", "col"],
  JP: ["japan", "japon", "nippon", "jpn"],
  CN: ["china", "chine", "people s republic of china", "chn"],
  HK: ["hong kong", "hkg"],
  KR: ["south korea", "korea", "coree du sud", "coree", "kor"],
  IN: ["india", "inde", "ind"],
  SG: ["singapore", "singapour", "sgp"],
  AE: ["united arab emirates", "uae", "emirats arabes unis", "dubai", "are"],
  SA: ["saudi arabia", "arabie saoudite", "sau"],
  IL: ["israel", "isr"],
  QA: ["qatar", "qat"],
  TH: ["thailand", "thailande", "tha"],
  VN: ["vietnam", "viet nam", "vnm"],
  ID: ["indonesia", "indonesie", "idn"],
  MY: ["malaysia", "malaisie", "mys"],
  PH: ["philippines", "phl"],
  TW: ["taiwan", "twn"],
  RU: ["russia", "russie", "russian federation", "rus"],
  UA: ["ukraine", "ukr"],
  LT: ["lithuania", "lituanie", "ltu"],
  LV: ["latvia", "lettonie", "lva"],
  EE: ["estonia", "estonie", "est"],
  SK: ["slovakia", "slovaquie", "svk"],
  SI: ["slovenia", "slovenie", "svn"],
  HR: ["croatia", "croatie", "hrv"],
  BG: ["bulgaria", "bulgarie", "bgr"],
  RS: ["serbia", "serbie", "srb"],
  CY: ["cyprus", "chypre", "cyp"],
  MT: ["malta", "malte", "mlt"],
  IS: ["iceland", "islande", "isl"],
  MC: ["monaco", "mco"],
  AD: ["andorra", "andorre", "and"],
  LI: ["liechtenstein", "lie"]
};
var COUNTRY_BY_NAME = /* @__PURE__ */ new Map();
for (const [code, names] of Object.entries(COUNTRY_NAMES)) {
  COUNTRY_BY_NAME.set(code.toLowerCase(), code);
  for (const n of names) COUNTRY_BY_NAME.set(n, code);
}
function normCountry(v) {
  const w = words(v);
  if (!w) return "";
  return COUNTRY_BY_NAME.get(w) ?? "";
}
var TITLE_EXPANSIONS = {
  dir: "directeur",
  resp: "responsable",
  dirg: "directeur general",
  dg: "directeur general",
  dga: "directeur general adjoint",
  pdg: "president directeur general",
  daf: "directeur administratif financier",
  drh: "directeur ressources humaines",
  dsi: "directeur systemes information",
  rh: "ressources humaines",
  hr: "human resources",
  ceo: "chief executive officer",
  cto: "chief technology officer",
  cfo: "chief financial officer",
  coo: "chief operating officer",
  cmo: "chief marketing officer",
  cro: "chief revenue officer",
  cpo: "chief product officer",
  cio: "chief information officer",
  chro: "chief human resources officer",
  cso: "chief sales officer",
  vp: "vice president",
  svp: "senior vice president",
  evp: "executive vice president",
  avp: "assistant vice president",
  mgr: "manager",
  sr: "senior",
  jr: "junior",
  asst: "assistant",
  eng: "engineer",
  dev: "developer",
  bizdev: "business development",
  sdr: "sales development representative",
  bdr: "business development representative",
  ops: "operations",
  mktg: "marketing",
  acct: "account",
  exec: "executive",
  pres: "president",
  gm: "general manager",
  md: "managing director",
  pm: "product manager",
  csm: "customer success manager",
  ux: "user experience",
  ui: "user interface",
  it: "information technology",
  si: "systemes information",
  rd: "research development",
  qa: "quality assurance",
  ca: "chiffre affaires",
  adv: "administration des ventes",
  compta: "comptabilite",
  com: "communication",
  tech: "technique",
  ingenieur: "ingenieur",
  ing: "ingenieur",
  dept: "departement",
  cie: "compagnie",
  intl: "international",
  mgmt: "management"
};
var TITLE_STOPWORDS = /* @__PURE__ */ new Set([
  "de",
  "du",
  "des",
  "la",
  "le",
  "les",
  "l",
  "d",
  "et",
  "en",
  "au",
  "aux",
  "a",
  "chez",
  "pour",
  "sur",
  "of",
  "the",
  "and",
  "at",
  "in",
  "for",
  "to",
  "with",
  "on"
]);
var GENERIC_TITLES = /* @__PURE__ */ new Set([
  "contact",
  "accueil",
  "standard",
  "direction",
  "secretariat",
  "administration",
  "information",
  "info",
  "salarie",
  "salariee",
  "employe",
  "employee",
  "employes",
  "staff",
  "collaborateur",
  "collaboratrice",
  "membre",
  "member",
  "team member",
  "personnel",
  "worker",
  "travailleur",
  "professionnel",
  "professional",
  "cadre",
  "stagiaire",
  "intern",
  "alternant",
  "alternante",
  "apprenti",
  "freelance",
  "independant",
  "consultant",
  "retraite",
  "retired",
  "etudiant",
  "student",
  "sans emploi",
  "unemployed",
  "autre",
  "other"
]);
function normJobTitle(v) {
  const w = words(v);
  if (!w || GENERIC_TITLES.has(w)) return "";
  const tokens = w.split(" ").flatMap((t) => (TITLE_EXPANSIONS[t] ?? t).split(" ")).filter((t) => t && !TITLE_STOPWORDS.has(t));
  const out = [...new Set(tokens)].join(" ");
  return GENERIC_TITLES.has(out) ? "" : out;
}
function tokenSet(s) {
  return new Set(s.split(" ").filter(Boolean));
}
function compareJobTitles(a, b) {
  if (!a || !b) return "unknown";
  if (a === b) return "same";
  const ta = tokenSet(a);
  const tb = tokenSet(b);
  let inter = 0;
  for (const t of ta) if (tb.has(t)) inter++;
  if (inter === 0) return "different";
  const union = ta.size + tb.size - inter;
  const jaccard2 = inter / union;
  if (jaccard2 >= 0.75) return "same";
  if (inter === ta.size || inter === tb.size) return "close";
  return jaccard2 >= 0.5 ? "close" : "unknown";
}
var DIMINUTIVES = {
  bob: ["robert"],
  rob: ["robert"],
  bobby: ["robert"],
  bert: ["robert", "albert", "herbert"],
  alex: ["alexandre", "alexander", "alexandra", "alexis", "alexia"],
  tom: ["thomas"],
  tommy: ["thomas"],
  kate: ["katherine", "katharine", "catherine", "kathleen"],
  katie: ["katherine", "katharine", "catherine"],
  kathy: ["katherine", "kathleen", "catherine"],
  cathy: ["catherine"],
  kat: ["katherine", "catherine"],
  bill: ["william"],
  will: ["william"],
  billy: ["william"],
  liam: ["william"],
  liz: ["elizabeth", "elisabeth"],
  beth: ["elizabeth", "elisabeth"],
  betty: ["elizabeth"],
  lisa: ["elizabeth", "elisabeth"],
  jim: ["james"],
  jimmy: ["james"],
  jamie: ["james"],
  mike: ["michael"],
  mick: ["michael"],
  mikey: ["michael"],
  dave: ["david"],
  davy: ["david"],
  dan: ["daniel"],
  danny: ["daniel"],
  chris: ["christopher", "christophe", "christian", "christine", "christina", "christiane"],
  steph: ["stephanie", "stephane", "stephen", "steven"],
  steve: ["stephen", "steven"],
  fred: ["frederic", "frederick", "frederik", "alfred"],
  freddy: ["frederic", "frederick"],
  ben: ["benjamin", "benoit", "benedict"],
  benj: ["benjamin"],
  sam: ["samuel", "samantha"],
  sammy: ["samuel", "samantha"],
  matt: ["matthew", "matthieu", "mathieu"],
  nick: ["nicolas", "nicholas"],
  nico: ["nicolas", "nicholas"],
  tony: ["anthony", "antoine", "antonio"],
  pat: ["patrick", "patricia"],
  paddy: ["patrick"],
  tricia: ["patricia"],
  trish: ["patricia"],
  max: ["maxime", "maximilien", "maximilian", "maxence"],
  seb: ["sebastien", "sebastian"],
  greg: ["gregory", "gregoire"],
  phil: ["philippe", "philip", "phillip"],
  joe: ["joseph"],
  joey: ["joseph"],
  jo: ["joseph", "josephine", "joanne"],
  jon: ["jonathan"],
  jonny: ["jonathan"],
  johnny: ["john", "jonathan"],
  jack: ["john"],
  ed: ["edward", "edouard", "edmond", "edgar"],
  eddie: ["edward", "edouard"],
  ted: ["edward", "theodore"],
  andy: ["andrew", "andre"],
  drew: ["andrew"],
  harry: ["henry", "harold"],
  hank: ["henry"],
  rick: ["richard"],
  dick: ["richard"],
  rich: ["richard"],
  ricky: ["richard"],
  ron: ["ronald"],
  ronnie: ["ronald"],
  don: ["donald"],
  donny: ["donald"],
  ken: ["kenneth"],
  kenny: ["kenneth"],
  charlie: ["charles"],
  chuck: ["charles"],
  charly: ["charles"],
  larry: ["lawrence", "laurence", "laurent"],
  jerry: ["gerald", "jerome", "gerard"],
  gerry: ["gerald", "gerard"],
  terry: ["terence"],
  pete: ["peter"],
  gabe: ["gabriel"],
  nat: ["nathalie", "natalie", "nathan", "nathaniel"],
  nate: ["nathan", "nathaniel"],
  vic: ["victor", "victoria"],
  vicky: ["victoria"],
  val: ["valerie", "valentin", "valentine"],
  manu: ["emmanuel", "emmanuelle", "manuel"],
  flo: ["florence", "florent", "florian"],
  caro: ["caroline", "carole"],
  isa: ["isabelle", "isabel", "isabella"],
  elo: ["elodie"],
  mat: ["mathieu", "matthieu", "mathilde"],
  gab: ["gabriel", "gabrielle"],
  dom: ["dominique", "dominic"],
  jc: ["jean claude", "jean christophe"],
  jp: ["jean pierre", "jean philippe", "jean paul"],
  jf: ["jean francois"],
  jm: ["jean marc", "jean michel", "jean marie"],
  pa: ["pierre alexandre", "pierre antoine"],
  pe: ["pierre emmanuel"],
  mc: ["marie christine", "marie claire", "marie claude"],
  mp: ["marie pierre"],
  al: ["albert", "alan", "alfred", "allan"],
  ali: ["alison", "alice"],
  sue: ["susan", "suzanne"],
  susie: ["susan", "suzanne"],
  peggy: ["margaret"],
  meg: ["margaret", "megan"],
  maggie: ["margaret"],
  nancy: ["ann", "anne"],
  sally: ["sarah"],
  molly: ["mary"],
  polly: ["mary"],
  becky: ["rebecca"],
  becca: ["rebecca"],
  jen: ["jennifer"],
  jenny: ["jennifer"],
  jess: ["jessica"],
  jessie: ["jessica"],
  abby: ["abigail"],
  gus: ["augustin", "auguste", "augustus"],
  oli: ["olivier", "oliver", "olivia"],
  ollie: ["oliver"]
};
var FEMININE_ENDINGS = ["e", "ne", "le", "ine", "ette", "tte", "elle", "te", "que", "a"];
function feminineOf(short, long) {
  if (long.length <= short.length) return false;
  if (!long.startsWith(short)) return false;
  return FEMININE_ENDINGS.includes(long.slice(short.length));
}
function finalVowelSwap(a, b) {
  if (a.length !== b.length || a.length < 4) return false;
  if (a.slice(0, -1) !== b.slice(0, -1)) return false;
  const ends = /* @__PURE__ */ new Set([a[a.length - 1], b[b.length - 1]]);
  return ends.has("a") && ends.has("e");
}
function firstNameTokens(v) {
  return words(v).split(" ").filter(Boolean);
}
function initialOf(token, other) {
  return token.length === 1 && other.length > 1 && other[0] === token;
}
function tokensCompatible(a, b) {
  if (a === b) return true;
  if (initialOf(a, b) || initialOf(b, a)) return true;
  const [short, long] = a.length <= b.length ? [a, b] : [b, a];
  if (feminineOf(short, long) || finalVowelSwap(a, b)) return false;
  if (DIMINUTIVES[a]?.includes(b) || DIMINUTIVES[b]?.includes(a)) return true;
  return a.length >= 4 && b.length >= 4 && levenshtein(a, b, 1) <= 1;
}
function firstNamesCompatible(a, b) {
  const ta = firstNameTokens(a);
  const tb = firstNameTokens(b);
  if (ta.length === 0 || tb.length === 0) return true;
  const [fewer, more] = ta.length <= tb.length ? [ta, tb] : [tb, ta];
  if (fewer.length === 1 && /^[a-z]{2,3}$/.test(fewer[0]) && more.length === fewer[0].length) {
    if (more.every((t, i) => t[0] === fewer[0][i])) return true;
  }
  if (fewer.length === 1 && more.length > 1) {
    const joined = more.join(" ");
    if (DIMINUTIVES[fewer[0]]?.includes(joined)) return true;
  }
  return fewer.every((t) => more.some((u) => tokensCompatible(t, u)));
}
var NAME_NOISE = /* @__PURE__ */ new Set([
  "mme",
  "mmes",
  "mr",
  "mrs",
  "ms",
  "madame",
  "monsieur",
  "mlle",
  "mademoiselle",
  "miss",
  "plus",
  "la",
  "de",
  "le",
  "du"
]);
function nameWords(v) {
  return words(v).split(" ").filter((t) => t && !NAME_NOISE.has(t));
}
function nameWordsConcord(a, b) {
  if (!a || !b) return false;
  if (a === b) return true;
  const [short, long] = a.length <= b.length ? [a, b] : [b, a];
  if (short.length === 1) return long[0] === short;
  if (short.length >= 3 && long.includes(short)) return true;
  if (short.length >= 4 && oneSlipApart(a, b)) return true;
  return lettersSwapped(a, b);
}
function lettersSwapped(a, b) {
  if (a.length !== b.length || a.length < 5) return false;
  const diff = [];
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      diff.push(i);
      if (diff.length > 2) return false;
    }
  }
  return diff.length === 2 && a[diff[0]] === b[diff[1]] && a[diff[1]] === b[diff[0]];
}
var anyConcord = (x, y) => x.some((t) => y.some((u) => nameWordsConcord(t, u)));
function compareNames(a, b) {
  const fa = nameWords(a.first);
  const la = nameWords(a.last);
  const fb = nameWords(b.first);
  const lb = nameWords(b.last);
  const wa = [...fa, ...la];
  const wb = [...fb, ...lb];
  if (wa.length === 0 || wb.length === 0) return "unknown";
  if (!anyConcord(wa, wb)) return "disjoint";
  if (fa.length > 0 && fb.length > 0 && la.length > 0 && lb.length > 0 && anyConcord(fa, fb) && !anyConcord(la, wb) && !anyConcord(lb, wa)) {
    return "different_last";
  }
  return "agree";
}
function namesSwapped(a, b) {
  const fa = nameWords(a.first);
  const la = nameWords(a.last);
  const fb = nameWords(b.first);
  const lb = nameWords(b.last);
  if (fa.length === 0 || la.length === 0 || fb.length === 0 || lb.length === 0) return false;
  const within = (x, y) => x.every((t) => y.includes(t));
  return within(fa, lb) && within(fb, la);
}
function namesClose(a, b) {
  if (compareNames(a, b) !== "agree") return false;
  if (namesSwapped(a, b)) return true;
  const fa = nameWords(a.first);
  const la = nameWords(a.last);
  const fb = nameWords(b.first);
  const lb = nameWords(b.last);
  if (fa.length === 0 || fb.length === 0 || la.length === 0 || lb.length === 0) return false;
  const full = (x) => x.filter((t) => t.length > 1);
  return firstNamesCompatible(fa.join(" "), fb.join(" ")) && anyConcord(full(la), full(lb));
}
function frenchPhoneKind(v, country) {
  const raw = str2(v);
  if (!raw) return "unknown";
  let d = raw.replace(/\D+/g, "");
  let national = "";
  if (/^(\+|00)/.test(raw)) {
    d = d.replace(/^00/, "");
    if (d.startsWith("33")) {
      let rest = d.slice(2);
      if (rest.length === 10 && rest[0] === "0") rest = rest.slice(1);
      if (rest.length === 9 && rest[0] !== "0") national = `0${rest}`;
    }
  } else if (country === "" || country === "FR") {
    if (d.length === 10 && d[0] === "0" && d[1] !== "0") national = d;
    else if (d.length === 11 && d.startsWith("33") && d[2] !== "0") national = `0${d.slice(2)}`;
    else if (country === "FR" && d.length === 9 && d[0] !== "0") national = `0${d}`;
  }
  if (!national) return "unknown";
  return /^0[67]/.test(national) ? "mobile" : "landline";
}
var GENERIC_LOCALS = /* @__PURE__ */ new Set([
  "info",
  "infos",
  "contact",
  "hello",
  "bonjour",
  "hi",
  "sales",
  "vente",
  "ventes",
  "commercial",
  "commerce",
  "admin",
  "administration",
  "office",
  "bureau",
  "support",
  "help",
  "aide",
  "service",
  "services",
  "serviceclient",
  "service-client",
  "customer",
  "customers",
  "clients",
  "client",
  "direction",
  "management",
  "rh",
  "hr",
  "jobs",
  "job",
  "careers",
  "career",
  "recrutement",
  "recruitment",
  "recruiting",
  "candidature",
  "candidatures",
  "marketing",
  "com",
  "communication",
  "presse",
  "press",
  "media",
  "compta",
  "comptabilite",
  "accounting",
  "accounts",
  "finance",
  "billing",
  "facturation",
  "invoice",
  "invoices",
  "noreply",
  "no-reply",
  "no_reply",
  "donotreply",
  "newsletter",
  "news",
  "team",
  "equipe",
  "accueil",
  "welcome",
  "reception",
  "partenariats",
  "partners",
  "partnership",
  "partnerships",
  "webmaster",
  "postmaster",
  "hostmaster",
  "abuse",
  "security",
  "it",
  "informatique",
  "dev",
  "tech",
  "technique",
  "secretariat",
  "assistant",
  "assistante",
  "general",
  "mail",
  "email",
  "courrier",
  "legal",
  "juridique",
  "dpo",
  "privacy",
  "rgpd",
  "gdpr",
  "order",
  "orders",
  "commande",
  "commandes",
  "achat",
  "achats",
  "purchasing",
  "export",
  "import",
  "logistique",
  "logistics",
  "qualite",
  "quality",
  "formation",
  "training",
  "events",
  "evenements",
  "store",
  "shop",
  "boutique",
  "agence",
  "agency"
]);
var alnum = (s) => s.replace(/[^a-z0-9]/g, "");
function isGenericEmailLocal(local) {
  const l = stripAccents(local.toLowerCase());
  return GENERIC_LOCALS.has(l) || GENERIC_LOCALS.has(alnum(l));
}
function localsDerivedFrom(first, last) {
  const out = /* @__PURE__ */ new Set();
  const f = alnum(words(first).replace(/ /g, ""));
  const l = alnum(words(last).replace(/ /g, ""));
  const ft = words(first).split(" ").filter(Boolean);
  const firsts = new Set([f, ...ft.map(alnum), ft.map((t) => alnum(t)[0] ?? "").join("")].filter(Boolean));
  for (const fi of firsts) {
    if (l) {
      out.add(fi + l);
      out.add(l + fi);
      out.add(fi[0] + l);
      out.add(l + fi[0]);
      out.add(fi + l[0]);
    }
    out.add(fi);
  }
  if (l) out.add(l);
  return out;
}
function emailLocalsCompatible(localA, localB, names) {
  const a = alnum(stripAccents(localA.toLowerCase()));
  const b = alnum(stripAccents(localB.toLowerCase()));
  if (!a || !b || a === b) return true;
  if (isGenericEmailLocal(localA) || isGenericEmailLocal(localB)) return true;
  if (a.includes(b) || b.includes(a)) return true;
  for (const n of names) {
    if (!n.first && !n.last) continue;
    const derived = localsDerivedFrom(n.first, n.last);
    if (derived.has(a) && derived.has(b)) return true;
  }
  return false;
}
function normZip(v) {
  const s = str2(v).toUpperCase().replace(/[\s.]/g, "");
  if (!/^[A-Z0-9-]{3,10}$/.test(s)) return "";
  if (/^(\d)\1+$/.test(s) || s === "12345") return "";
  return s;
}
var ADDRESS_WORDS = {
  av: "avenue",
  ave: "avenue",
  bd: "boulevard",
  bld: "boulevard",
  blvd: "boulevard",
  pl: "place",
  rte: "route",
  ch: "chemin",
  imp: "impasse",
  all: "allee",
  sq: "square",
  crs: "cours",
  qu: "quai",
  fg: "faubourg",
  fbg: "faubourg",
  res: "residence",
  bat: "batiment",
  st: "saint",
  ste: "sainte",
  str: "strasse",
  rd: "road",
  dr: "drive",
  ln: "lane",
  ct: "court"
};
function normAddress(v) {
  const w = words(v);
  if (!w) return "";
  return w.split(" ").map((t) => ADDRESS_WORDS[t] ?? t).join(" ");
}
function normEmployees(v) {
  const s = str2(v).replace(/[\s,]/g, "");
  if (!s) return null;
  const m = s.match(/^(\d+)(?:-(\d+)|\+)?$/);
  if (!m) return null;
  const n = Number(m[1]);
  return Number.isFinite(n) && n > 0 ? n : null;
}
function normYear(v) {
  const m = str2(v).match(/\b(1[5-9]\d{2}|20\d{2})\b/);
  if (!m) return null;
  const y = Number(m[1]);
  return y <= (/* @__PURE__ */ new Date()).getFullYear() + 1 ? y : null;
}

// engine/duplicate-weights.ts
var BONUS_CAP = 15;
var MAX_SCORE = 100;
var CONTACT_BASE = {
  same_linkedin: 100,
  same_email: 95,
  same_email_secondary: 95,
  same_mobile: 85,
  same_name_phone: 85,
  same_phone_name_missing: 70,
  same_name_company: 80,
  same_name_email_domain: 75,
  same_name_only: 70,
  exact_fuzzy_name: 75,
  fuzzy_full_name: 70,
  swapped_name: 70,
  same_email_local: 65,
  near_email_local: 75
};
var CONTACT_BASE_WEAK = {
  exact_fuzzy_name: 65,
  fuzzy_full_name: 65,
  same_name_phone: 75
};
var COMPANY_BASE = {
  same_siren: 95,
  same_domain: 90,
  same_linkedin_corroborated: 90,
  same_linkedin_alone: 75,
  same_name_domain_root: 80,
  same_domain_root_other_tld: 80,
  same_name_city: 75,
  fuzzy_name_same_domain: 80,
  ghost_domain_root: 80,
  same_name_no_domain_one_side: 80,
  fuzzy_name_no_domain_one_side: 80,
  same_name_different_roots: 80,
  fuzzy_name_fuzzy_root: 80
};
var CONTACT_BONUS = {
  same_email_domain: 5,
  same_company: 5,
  same_job_title: 5,
  second_identifier: 5,
  same_location: 3,
  email_matches_website: 3
};
var CONTACT_MALUS = {
  different_mobile: 10,
  different_country: 10,
  different_email_person: 10,
  different_job_title: 3,
  different_names_phone_link: 40,
  different_names: 25,
  different_last_name: 10
};
var NAME_MALUS = /* @__PURE__ */ new Set([
  "different_names_phone_link",
  "different_names",
  "different_last_name"
]);
var MIN_BASE_SCORE = { contact: 65, company: 70 };
var COMPANY_BONUS = {
  same_phone: 5,
  same_zip: 5,
  same_address: 5,
  same_industry: 3,
  same_country: 3,
  same_founded_year: 3
};
var COMPANY_MALUS = {
  different_country: 15,
  different_founded_year: 10,
  incompatible_employees: 5,
  different_zip: 5,
  different_phone: 3
};
function customisedRules(rules) {
  return Boolean(rules && (rules.off.size > 0 || (rules.custom?.length ?? 0) > 0));
}
var JIPUP_SCORE_RULES = Object.freeze({ off: /* @__PURE__ */ new Set() });
var FOUNDED_YEAR_TOLERANCE = 2;
var EMPLOYEES_RATIO = 10;
var EMPLOYEES_MIN = 10;

// engine/agents/duplicate-scoring.ts
var MIN_SCORE_TO_CONSIDER = { ...MIN_BASE_SCORE };
var EMPTY_SCORE = () => ({
  score: 0,
  baseScore: 0,
  reasons: [],
  evidence: [],
  bonus: [],
  malus: [],
  vetos: []
});
function scoreSheet(rules) {
  const out = EMPTY_SCORE();
  const off = rules.off;
  const hit = (score, code, values, corroboration) => {
    if (off.has(code)) return;
    out.reasons.push(EVIDENCE_REASON_EN(code, corroboration));
    const shared = values?.filter(Boolean) ?? [];
    out.evidence.push({
      code,
      score,
      ...shared.length > 0 ? { values: shared } : {},
      ...corroboration ? { with: corroboration } : {}
    });
    if (score > out.baseScore) out.baseScore = score;
  };
  const adjust = (list, code, points, values) => {
    if (off.has(code)) return;
    const shown = values?.filter(Boolean) ?? [];
    list.push({ code, points, ...shown.length > 0 ? { values: shown } : {} });
  };
  const bonus = (code, points, values) => adjust(out.bonus, code, points, values);
  const malus = (code, points, values) => adjust(out.malus, code, -points, values);
  const veto = (code, a, b) => {
    if (!off.has(code)) out.vetos.push({ code, values: [a, b] });
  };
  const settle = () => {
    const plus = Math.min(out.bonus.reduce((n, x) => n + x.points, 0), BONUS_CAP);
    const minus = out.malus.reduce((n, x) => n + x.points, 0);
    out.score = Math.max(0, Math.min(MAX_SCORE, out.baseScore + plus + minus));
    return out;
  };
  const consumed = () => {
    const set = /* @__PURE__ */ new Set();
    for (const e of out.evidence) {
      if (e.score !== out.baseScore) continue;
      for (const s of RULE_SIGNALS[e.code] ?? []) set.add(s);
      if (e.with) for (const s of CORROBORATION_SIGNALS[e.with] ?? []) set.add(s);
    }
    return set;
  };
  const custom = rules.custom ?? [];
  const customIdentifiers = (a, b) => {
    for (const c of custom) {
      if (c.effect !== "identifier") continue;
      const v = a?.[c.id];
      if (!v || v !== b?.[c.id]) continue;
      out.reasons.push(customReasonEn("identifier", c.label));
      out.evidence.push({ code: `custom:${c.id}`, score: c.points, values: [v], label: c.label });
      if (c.points > out.baseScore) out.baseScore = c.points;
    }
  };
  const customAdjustments = (a, b) => {
    for (const c of custom) {
      if (c.effect === "identifier") continue;
      const va = a?.[c.id] ?? "";
      const vb = b?.[c.id] ?? "";
      if (!va || !vb) continue;
      const code = `custom:${c.id}`;
      if (c.effect === "bonus") {
        if (va === vb) out.bonus.push({ code, points: c.points, values: [va], label: c.label });
      } else if (customDiffer(c.comparator, va, vb)) {
        if (c.effect === "malus") out.malus.push({ code, points: -c.points, values: [va, vb], label: c.label });
        else out.vetos.push({ code, values: [va, vb], label: c.label });
      }
    }
  };
  return { out, off, hit, bonus, malus, veto, settle, consumed, customIdentifiers, customAdjustments };
}
function customValueOf(comparator, raw) {
  const text = junkToEmpty(stripAccents(str2(raw).toLowerCase()).replace(/\s+/g, " ").trim());
  if (!text) return "";
  switch (comparator) {
    case "text":
      return text;
    case "email":
      return normEmail(text);
    case "phone":
      return phoneTailOf(text);
    case "domain":
      return normDomain(text);
    case "linkedin": {
      const profile = normLinkedin(text);
      if (profile) return profile;
      const page = normLinkedinCompanySlug(text);
      return page ? `linkedin.com/company/${page}` : "";
    }
    case "number": {
      const n = Number(text.replace(/[\s\u00a0]/g, "").replace(",", "."));
      return Number.isFinite(n) && n !== 0 ? String(n) : "";
    }
    case "date": {
      const ms = /^\d{10,13}$/.test(text) ? Number(text.length === 10 ? `${text}000` : text) : Date.parse(text);
      return Number.isFinite(ms) && ms > 0 ? new Date(ms).toISOString().slice(0, 10) : "";
    }
    case "list": {
      const items = [...new Set(text.split(";").map((v) => junkToEmpty(v.trim())).filter(Boolean))].sort();
      return items.join(";");
    }
  }
}
function customLinkedinKind(url) {
  if (/\/in\/acwaa/.test(url)) return "member_id";
  return /\/company\/\d+$/.test(url) ? "page_id" : "slug";
}
function customDiffer(comparator, a, b) {
  if (a === b) return false;
  if (comparator === "linkedin") return customLinkedinKind(a) === customLinkedinKind(b);
  return true;
}
function customValuesOf(p, rules) {
  const custom = rules?.custom;
  if (!custom || custom.length === 0) return void 0;
  const out = {};
  for (const c of custom) {
    const v = customValueOf(c.comparator, p[c.property]);
    if (v) out[c.id] = v;
  }
  return out;
}
function customKeys(values, rules) {
  const custom = rules.custom;
  if (!custom || !values) return [];
  const keys = [];
  for (const c of custom) {
    if (c.effect === "identifier" && values[c.id]) keys.push(`cu:${c.id}:${values[c.id]}`);
  }
  return keys;
}
var RULE_SIGNALS = {
  same_linkedin: ["linkedin"],
  same_email: ["email", "email_domain"],
  same_email_secondary: ["email", "email_domain"],
  same_mobile: ["mobile", "phone"],
  same_name_phone: ["name", "phone", "mobile"],
  same_phone_name_missing: ["phone", "mobile"],
  same_name_company: ["name", "company"],
  same_name_email_domain: ["name", "email_domain"],
  same_name_only: ["name"],
  exact_fuzzy_name: ["name"],
  fuzzy_full_name: ["name"],
  swapped_name: ["name"],
  same_email_local: ["email"],
  near_email_local: ["email", "email_domain"]
};
var CORROBORATION_SIGNALS = {
  same_company: ["company"],
  similar_company: ["company"],
  same_associated_company: ["company"],
  same_email_domain_root: ["email_domain"],
  same_phone: ["phone", "mobile"]
};
var PLACEHOLDER_VALUES = /* @__PURE__ */ new Set([
  "n/a",
  "na",
  "none",
  "null",
  "nil",
  "undefined",
  "unknown",
  "inconnu",
  "aucun",
  "aucune",
  "tbd",
  "todo",
  "test",
  "x",
  "xx",
  "xxx",
  "xxxx",
  "a completer",
  "a definir",
  "a remplir",
  "0",
  "1",
  "-",
  "."
]);
function junkToEmpty(s) {
  if (!s) return "";
  if (!/[\p{L}\p{N}]/u.test(s)) return "";
  return PLACEHOLDER_VALUES.has(s) ? "" : s;
}
var LEGAL_SUFFIXES = /\b(sa|sas|sarl|sasu|eurl|inc|llc|ltd|gmbh|corp|corporation|company|co|sl|srl|bv|ag|plc|limited)\b/g;
var GROUP_WORDS = /\b(group|groupe|holding|holdings)\b/g;
function normName(v) {
  const s = stripAccents(str2(v)).toLowerCase().replace(/\s+/g, " ").trim();
  if (!junkToEmpty(s)) return "";
  return s.replace(/['’`]/g, "").replace(/[^\p{L}\p{N}]+/gu, " ").replace(/\s+/g, " ").trim();
}
function normCompanyNameWith(v, stripGroupWords) {
  let s = str2(v);
  const m = s.match(/^\s*(.+?)\s*,\s*(.+?)\s*$/);
  if (m && m[1].toLowerCase() === m[2].toLowerCase()) s = m[1];
  s = stripAccents(s).toLowerCase();
  if (!junkToEmpty(s.trim())) return "";
  if (stripGroupWords) s = s.replace(GROUP_WORDS, " ");
  return s.replace(LEGAL_SUFFIXES, " ").replace(/[^a-z0-9]+/g, " ").replace(/\s+/g, " ").trim();
}
function normCompanyIdentity(v) {
  return normCompanyNameWith(v, false);
}
var PUBLIC_EMAIL_ROOTS = /* @__PURE__ */ new Set([
  "gmail",
  "googlemail",
  "hotmail",
  "outlook",
  "live",
  "msn",
  "yahoo",
  "ymail",
  "rocketmail",
  "aol",
  "icloud",
  "me",
  "mac",
  "protonmail",
  "proton",
  "pm",
  "gmx",
  "yandex",
  "qq",
  "163",
  "126",
  "mail",
  "web",
  "t-online",
  "zoho",
  "fastmail",
  "tutanota",
  "tuta",
  "hey",
  "posteo",
  "mailbox",
  "hushmail",
  "rediffmail",
  "libero",
  "virgilio",
  "tiscali",
  "btinternet",
  "ntlworld",
  "bigpond",
  "optusnet",
  "xtra",
  "sympatico",
  "videotron",
  "comcast",
  "sbcglobal",
  "bellsouth",
  "verizon",
  "att",
  "cox",
  "charter",
  "rogers",
  "shaw",
  "telenet",
  "skynet",
  "bluewin",
  "sunrise",
  "naver",
  "daum",
  "hanmail"
]);
var PUBLIC_EMAIL_DOMAINS = /* @__PURE__ */ new Set([
  "orange.fr",
  "wanadoo.fr",
  "free.fr",
  "sfr.fr",
  "laposte.net",
  "bbox.fr",
  "neuf.fr",
  "numericable.fr",
  "aliceadsl.fr",
  "club-internet.fr",
  "voila.fr",
  "cegetel.net",
  "nordnet.fr",
  "dbmail.com",
  "sky.com",
  "virginmedia.com",
  "telefonica.net",
  "terra.com",
  "uol.com.br",
  "bol.com.br",
  "ig.com.br",
  "wp.pl",
  "onet.pl",
  "o2.pl",
  "seznam.cz",
  "centrum.cz",
  "abv.bg",
  "freenet.de",
  "arcor.de",
  "online.de",
  "ziggo.nl",
  "kpnmail.nl",
  "home.nl",
  "planet.nl",
  "hetnet.nl",
  "telia.com",
  "telenor.no",
  "online.no"
]);
function isPublicEmailDomain(domain) {
  if (!domain) return false;
  return PUBLIC_EMAIL_DOMAINS.has(domain) || PUBLIC_EMAIL_ROOTS.has(domainCoreOf(domain));
}
function normEmail(v) {
  const s = stripAccents(str2(v).toLowerCase());
  return /^[^@\s]+@[^@\s]+\.[^@\s.]+$/.test(s) ? s : "";
}
function normPhoneDigits(v) {
  return str2(v).replace(/\D+/g, "").replace(/^0+/, "");
}
function phoneTailOf(...values) {
  for (const v of values) {
    const digits = normPhoneDigits(v);
    if (digits.length < 9) continue;
    const tail = digits.slice(-9);
    if (/^(\d)\1{8}$/.test(tail)) continue;
    return tail;
  }
  return "";
}
function splitMulti(primary, extra, norm2) {
  const out = [];
  const seen = /* @__PURE__ */ new Set();
  const push = (v) => {
    if (v && !seen.has(v)) {
      seen.add(v);
      out.push(v);
    }
  };
  push(primary);
  for (const part of str2(extra).split(/[;,\s]+/)) push(norm2(part));
  return out;
}
function sharedValue(a, b) {
  if (a.length === 0 || b.length === 0) return "";
  const setB = new Set(b);
  for (const v of a) if (setB.has(v)) return v;
  return "";
}
function cleanLinkedin(v) {
  let s = str2(v).toLowerCase();
  if (!s) return "";
  if (s.includes(",")) s = s.split(",")[0].trim();
  s = s.split(/[?#]/)[0];
  s = s.replace(/^https?:\/\/(www\.)?/, "");
  s = s.replace(/\/+$/, "");
  try {
    s = decodeURIComponent(s);
  } catch {
  }
  return stripAccents(s);
}
function normLinkedin(v) {
  const s = cleanLinkedin(v);
  return /^(?:[a-z0-9-]+\.)*linkedin\.com\/[^/]+\/./.test(s) ? s : "";
}
function normLinkedinCompanySlug(v) {
  const s = cleanLinkedin(v);
  if (!s) return "";
  const m = s.match(/company\/([^/?#]+)/);
  const slug = m ? m[1] : /linkedin\.com/.test(s) ? "" : s;
  return slug.length >= 2 && /^[\p{L}\p{N}][\p{L}\p{N}._-]*$/u.test(slug) ? slug : "";
}
function normDomain(v) {
  let s = str2(v).toLowerCase();
  if (!s) return "";
  const at = s.lastIndexOf("@");
  if (at >= 0) s = s.slice(at + 1);
  s = s.replace(/^https?:\/\//, "").replace(/^www\./, "");
  s = s.split(/[/?#:]/)[0].replace(/\.+$/, "");
  return /^[a-z0-9][a-z0-9.-]*\.[a-z]{2,}$/.test(s) ? s : "";
}
var TWO_LEVEL_TLDS = /* @__PURE__ */ new Set([
  "co.uk",
  "com.br",
  "com.au",
  "co.jp",
  "co.nz",
  "co.za",
  "com.mx",
  "co.in"
]);
function domainCoreOf(domain) {
  if (!domain) return "";
  const parts = domain.split(".").filter(Boolean);
  if (parts.length < 2) return domain;
  const lastTwo = parts.slice(-2).join(".");
  const depth = TWO_LEVEL_TLDS.has(lastTwo) ? 3 : 2;
  return parts.length < depth ? parts[0] : parts[parts.length - depth];
}
function jaccard(a, b) {
  if (a.length === 0 || b.length === 0) return 0;
  const setA = new Set(a);
  const setB = new Set(b);
  let inter = 0;
  for (const t of setA) if (setB.has(t)) inter++;
  return inter / (setA.size + setB.size - inter);
}
function fuzzyFullName(a, b) {
  return Boolean(a && b && a !== b && a.length >= 6 && b.length >= 6 && levenshtein(a, b, 1) <= 1);
}
function fuzzyNamePart(a, b) {
  return Boolean(a && b && a !== b && a.length >= 4 && b.length >= 4 && levenshtein(a, b, 1) <= 1);
}
function fuzzyCompanyName(a, b) {
  return Boolean(a && b && a !== b && a.length >= 5 && b.length >= 5 && levenshtein(a, b, 1) <= 1);
}
function mobileFieldIsLandline(p) {
  return Boolean(phoneTailOf(p.mobilephone)) && frenchPhoneKind(p.mobilephone, normCountry(p.country)) === "landline";
}
function normalizeContact(id, p, rules) {
  const custom = customValuesOf(p, rules);
  const email = normEmail(p.email);
  const at = email.indexOf("@");
  const emailLocal2 = at > 0 ? email.slice(0, at) : "";
  const emailDomain3 = at > 0 ? email.slice(at + 1) : "";
  const first = normName(p.firstname);
  const last = normName(p.lastname);
  const company = normCompanyIdentity(p.company);
  const country = normCountry(p.country);
  const mobileFieldTail = phoneTailOf(p.mobilephone);
  const mobileIsLandline = mobileFieldIsLandline(p);
  const phoneTail = phoneTailOf(p.phone);
  const mobileTail = mobileIsLandline ? "" : mobileFieldTail;
  const landlineTail = phoneTail || (mobileIsLandline ? mobileFieldTail : "");
  return {
    id: String(id),
    email,
    emails: splitMulti(email, p.hs_additional_emails, normEmail),
    emailLocal: emailLocal2,
    emailLocalCore: emailLocal2.replace(/[^a-z0-9]/g, ""),
    emailDomain: emailDomain3,
    emailDomainCore: domainCoreOf(emailDomain3),
    emailDomainPublic: isPublicEmailDomain(emailDomain3),
    mobileTail,
    landlineTail,
    phoneTails: [...new Set([mobileFieldTail, phoneTail].filter(Boolean))],
    first,
    last,
    fullname: `${first} ${last}`.trim(),
    company,
    companyTokens: company.split(" ").filter(Boolean),
    associatedCompanyId: str2(p.associatedcompanyid),
    linkedin: normLinkedin(p.hs_linkedin_url),
    createdate: str2(p.createdate),
    jobTitle: normJobTitle(p.jobtitle),
    country,
    city: normName(p.city),
    zip: normZip(p.zip),
    websiteCore: domainCoreOf(normDomain(p.website)),
    ...custom ? { custom } : {}
  };
}
function linkedinKind(url) {
  return /\/in\/acwaa/.test(url) ? "member_id" : "slug";
}
function both(a, b) {
  return a && a === b ? a : "";
}
function differ(a, b) {
  return Boolean(a && b && a !== b);
}
function contactAdjustments(a, b, sheet) {
  const used = sheet.consumed();
  const { bonus, malus, veto } = sheet;
  if (differ(a.linkedin, b.linkedin) && linkedinKind(a.linkedin) === linkedinKind(b.linkedin)) {
    veto("different_linkedin", a.linkedin, b.linkedin);
  }
  const swapped = namesSwapped(a, b);
  if (!swapped && !firstNamesCompatible(a.first, b.first)) veto("incompatible_first_names", a.first, b.first);
  const domainRoot = sharedCompanyDomainRoot(a, b);
  const twoPeople = Boolean(domainRoot) && differ(a.emailLocal, b.emailLocal) && !oneSlipApart(a.emailLocalCore, b.emailLocalCore) && !emailLocalsCompatible(a.emailLocal, b.emailLocal, [
    { first: a.first, last: a.last },
    { first: b.first, last: b.last }
  ]);
  if (domainRoot && !twoPeople && !used.has("email_domain")) {
    bonus("same_email_domain", CONTACT_BONUS.same_email_domain, [domainRoot]);
  }
  const companyMatch = both(a.company, b.company) || both(a.associatedCompanyId, b.associatedCompanyId) || jaccard(a.companyTokens, b.companyTokens) >= 0.7;
  if (companyMatch && !used.has("company")) bonus("same_company", CONTACT_BONUS.same_company, [both(a.company, b.company)]);
  const roleRecord = (c) => Boolean(c.jobTitle) && c.jobTitle === normJobTitle(c.fullname);
  const titles = roleRecord(a) || roleRecord(b) ? "unknown" : compareJobTitles(a.jobTitle, b.jobTitle);
  if (titles === "same") bonus("same_job_title", CONTACT_BONUS.same_job_title, [a.jobTitle]);
  const { off } = sheet;
  const secondId = !used.has("linkedin") && !off.has("same_linkedin") && both(a.linkedin, b.linkedin) || !used.has("email") && !(off.has("same_email") && off.has("same_email_secondary")) && sharedValue(a.emails, b.emails) || !used.has("mobile") && !off.has("same_mobile") && both(a.mobileTail, b.mobileTail);
  if (secondId) bonus("second_identifier", CONTACT_BONUS.second_identifier, [secondId]);
  const place = both(a.city, b.city) || both(a.country, b.country);
  if (place) bonus("same_location", CONTACT_BONUS.same_location, [place]);
  if (a.websiteCore && b.websiteCore && !a.emailDomainPublic && !b.emailDomainPublic && a.emailDomainCore === a.websiteCore && b.emailDomainCore === b.websiteCore) {
    bonus("email_matches_website", CONTACT_BONUS.email_matches_website);
  }
  if (differ(a.mobileTail, b.mobileTail)) malus("different_mobile", CONTACT_MALUS.different_mobile, [a.mobileTail, b.mobileTail]);
  if (differ(a.country, b.country)) malus("different_country", CONTACT_MALUS.different_country, [a.country, b.country]);
  if (twoPeople) malus("different_email_person", CONTACT_MALUS.different_email_person, [a.emailLocal, b.emailLocal]);
  if (titles === "different") malus("different_job_title", CONTACT_MALUS.different_job_title, [a.jobTitle, b.jobTitle]);
  nameContradiction(a, b, sheet);
}
var CLOSE_NAME_RULES = /* @__PURE__ */ new Set(["same_name_phone", "exact_fuzzy_name", "fuzzy_full_name", "swapped_name"]);
var PHONE_LINK_RULES = /* @__PURE__ */ new Set(["same_mobile", "same_phone_name_missing"]);
var IDENTITY_RULES = /* @__PURE__ */ new Set(["same_linkedin", "same_email", "same_email_secondary"]);
function nameContradiction(a, b, sheet) {
  const fired = sheet.out.evidence.map((e) => e.code);
  if (fired.some((c) => IDENTITY_RULES.has(c))) return;
  const relation = compareNames(a, b);
  if (relation === "disjoint") {
    const names = [a.fullname, b.fullname];
    if (fired.every((c) => PHONE_LINK_RULES.has(c))) {
      sheet.malus("different_names_phone_link", CONTACT_MALUS.different_names_phone_link, names);
    } else {
      sheet.malus("different_names", CONTACT_MALUS.different_names, names);
    }
  } else if (relation === "different_last") {
    sheet.malus("different_last_name", CONTACT_MALUS.different_last_name, [a.last, b.last]);
  }
}
function sharedCompanyDomainRoot(a, b) {
  if (a.emailDomainPublic || b.emailDomainPublic) return "";
  return a.emailDomainCore && a.emailDomainCore === b.emailDomainCore ? a.emailDomainCore : "";
}
function contactCorroboration(a, b) {
  if (a.company && a.company === b.company) return "same_company";
  if (jaccard(a.companyTokens, b.companyTokens) >= 0.7) return "similar_company";
  if (a.associatedCompanyId && a.associatedCompanyId === b.associatedCompanyId)
    return "same_associated_company";
  if (sharedCompanyDomainRoot(a, b)) return "same_email_domain_root";
  if (sharedValue(a.phoneTails, b.phoneTails)) return "same_phone";
  return null;
}
function scoreContactPair(a, b, rules = JIPUP_SCORE_RULES) {
  const sheet = scoreSheet(rules);
  const { hit } = sheet;
  if (a.linkedin && a.linkedin === b.linkedin) hit(CONTACT_BASE.same_linkedin, "same_linkedin", [a.linkedin]);
  const sharedEmail = sharedValue(a.emails, b.emails);
  if (sharedEmail) {
    const code = sharedEmail === a.email && sharedEmail === b.email ? "same_email" : "same_email_secondary";
    hit(CONTACT_BASE[code], code, [sharedEmail]);
  }
  const sameFullName = Boolean(a.fullname && a.fullname === b.fullname);
  const sharedPhone = sharedValue(a.phoneTails, b.phoneTails);
  if (a.mobileTail && a.mobileTail === b.mobileTail) hit(CONTACT_BASE.same_mobile, "same_mobile", [a.mobileTail]);
  if (sharedPhone) {
    if (sameFullName) hit(CONTACT_BASE.same_name_phone, "same_name_phone", [a.fullname, sharedPhone]);
    else if (!a.fullname || !b.fullname) hit(CONTACT_BASE.same_phone_name_missing, "same_phone_name_missing", [sharedPhone]);
  }
  const companyMatch = a.company && a.company === b.company || a.associatedCompanyId && a.associatedCompanyId === b.associatedCompanyId || jaccard(a.companyTokens, b.companyTokens) >= 0.7;
  if (sameFullName) {
    const domainRoot = sharedCompanyDomainRoot(a, b);
    if (companyMatch)
      hit(CONTACT_BASE.same_name_company, "same_name_company", [a.fullname, a.company === b.company ? a.company : ""]);
    else if (domainRoot) hit(CONTACT_BASE.same_name_email_domain, "same_name_email_domain", [a.fullname, domainRoot]);
    else hit(CONTACT_BASE.same_name_only, "same_name_only", [a.fullname]);
  }
  const corrob = contactCorroboration(a, b);
  const exactPlusFuzzy = a.first && a.first === b.first && fuzzyNamePart(a.last, b.last) || a.last && a.last === b.last && fuzzyNamePart(a.first, b.first);
  if (exactPlusFuzzy) hit(corrob ? CONTACT_BASE.exact_fuzzy_name : CONTACT_BASE_WEAK.exact_fuzzy_name, "exact_fuzzy_name", void 0, corrob ?? "none");
  if (fuzzyFullName(a.fullname, b.fullname)) hit(corrob ? CONTACT_BASE.fuzzy_full_name : CONTACT_BASE_WEAK.fuzzy_full_name, "fuzzy_full_name", void 0, corrob ?? "none");
  if (a.first && a.last && a.first === b.last && a.last === b.first) {
    hit(CONTACT_BASE.swapped_name, "swapped_name");
  }
  if (a.emailLocal && b.emailLocal && a.emailLocal === b.emailLocal && a.emailDomain !== b.emailDomain) {
    hit(CONTACT_BASE.same_email_local, "same_email_local", [a.emailLocal]);
  }
  if (a.emailLocalCore.length >= 5 && b.emailLocalCore.length >= 5 && a.emailLocal !== b.emailLocal && a.emailDomainCore && a.emailDomainCore === b.emailDomainCore && levenshtein(a.emailLocalCore, b.emailLocalCore, 1) <= 1) {
    hit(CONTACT_BASE.near_email_local, "near_email_local", [a.emailDomainCore]);
  }
  if (sharedPhone && !sameFullName && !sheet.out.evidence.some((e) => CLOSE_NAME_RULES.has(e.code)) && namesClose(a, b)) {
    hit(CONTACT_BASE_WEAK.same_name_phone, "same_name_phone", [a.fullname, sharedPhone]);
  }
  sheet.customIdentifiers(a.custom, b.custom);
  if (sheet.out.baseScore === 0) return sheet.settle();
  contactAdjustments(a, b, sheet);
  sheet.customAdjustments(a.custom, b.custom);
  return sheet.settle();
}
function contactBlockingKeys(c, rules = JIPUP_SCORE_RULES) {
  const keys = [];
  if (c.linkedin) keys.push(`ln:${c.linkedin}`);
  for (const e of c.emails) keys.push(`em:${e}`);
  for (const t of c.phoneTails) keys.push(`ph:${t}`);
  if (c.fullname && c.fullname.length >= 3) {
    if (!rules.off.has("same_name_only")) keys.push(`fn:${c.fullname}`);
    else keys.push(...homonymKeys(c, rules.off));
  }
  if (c.company) keys.push(`co:${c.company}`);
  if (c.associatedCompanyId) keys.push(`ac:${c.associatedCompanyId}`);
  if (c.emailDomainCore && !c.emailDomainPublic) keys.push(`dc:${c.emailDomainCore}`);
  if (rules.custom) keys.push(...customKeys(c.custom, rules));
  return keys;
}
function homonymKeys(c, off) {
  const keys = [];
  const name = `fn:${c.fullname}`;
  if (!off.has("same_name_company")) {
    for (const t of new Set(c.companyTokens)) keys.push(`${name}|t:${t}`);
  }
  if (!off.has("same_email_local") && c.emailLocal) keys.push(`${name}|l:${c.emailLocal}`);
  if (!off.has("near_email_local") && c.emailDomainPublic && c.emailDomainCore) keys.push(`${name}|d:${c.emailDomainCore}`);
  return keys;
}
var ACCOUNT_KEY = /^(co|ac|dc):/;
function contactRefineKeys(key, c, rules = JIPUP_SCORE_RULES) {
  const account = ACCOUNT_KEY.test(key);
  const own = contactBlockingKeys(c, rules);
  if (rules.off.has("same_name_only") && c.fullname && c.fullname.length >= 3) own.push(`fn:${c.fullname}`);
  const out = own.filter((k) => k !== key && !(account && ACCOUNT_KEY.test(k)));
  if (account) {
    for (const t of new Set(`${c.first} ${c.last}`.split(" "))) {
      if (t.length >= 2) out.push(`nt:${t}`);
    }
  }
  return out;
}
function normSiren(v) {
  const digits = str2(v).replace(/[\s.\-]/g, "");
  const siren = /^\d{9}$/.test(digits) ? digits : /^\d{14}$/.test(digits) ? digits.slice(0, 9) : "";
  return /^(\d)\1{8}$/.test(siren) ? "" : siren;
}
function normalizeCompany(id, p, rules) {
  const custom = customValuesOf(p, rules);
  const domain = normDomain(p.domain || p.website);
  const domains = splitMulti(domain, p.hs_additional_domains, normDomain);
  return {
    id: String(id),
    name: normCompanyIdentity(p.name),
    domain,
    domainCore: domainCoreOf(domain),
    domains,
    domainCores: [...new Set(domains.map(domainCoreOf).filter(Boolean))],
    linkedin: normLinkedinCompanySlug(p.linkedin_company_page || p.hs_linkedin_handle),
    city: normName(p.city),
    siren: normSiren(p.jipup_siren) || normSiren(p.siren),
    createdate: str2(p.createdate),
    country: normCountry(p.country),
    zip: normZip(p.zip),
    address: normAddress(p.address),
    phoneTail: phoneTailOf(p.phone),
    industry: normName(p.industry),
    foundedYear: normYear(p.founded_year),
    employees: normEmployees(p.numberofemployees),
    parentId: str2(p.hs_parent_company_id),
    ...custom ? { custom } : {}
  };
}
function parentSubsidiary(a, b) {
  return Boolean(a.parentId) && a.parentId === b.id || Boolean(b.parentId) && b.parentId === a.id;
}
function companyAdjustments(a, b, sheet) {
  const { bonus, malus, veto } = sheet;
  if (differ(a.siren, b.siren)) veto("different_siren", a.siren, b.siren);
  if (differ(a.linkedin, b.linkedin) && /^\d+$/.test(a.linkedin) === /^\d+$/.test(b.linkedin)) {
    veto("different_company_linkedin", a.linkedin, b.linkedin);
  }
  if (both(a.phoneTail, b.phoneTail)) bonus("same_phone", COMPANY_BONUS.same_phone, [a.phoneTail]);
  if (both(a.zip, b.zip)) bonus("same_zip", COMPANY_BONUS.same_zip, [a.zip]);
  if (both(a.address, b.address)) bonus("same_address", COMPANY_BONUS.same_address, [a.address]);
  if (both(a.industry, b.industry)) bonus("same_industry", COMPANY_BONUS.same_industry, [a.industry]);
  if (both(a.country, b.country)) bonus("same_country", COMPANY_BONUS.same_country, [a.country]);
  if (a.foundedYear !== null && a.foundedYear === b.foundedYear) {
    bonus("same_founded_year", COMPANY_BONUS.same_founded_year, [String(a.foundedYear)]);
  }
  const sameCountry = both(a.country, b.country);
  if (differ(a.country, b.country) && !sharedValue(a.domains, b.domains)) {
    malus("different_country", COMPANY_MALUS.different_country, [a.country, b.country]);
  }
  if (a.foundedYear !== null && b.foundedYear !== null && Math.abs(a.foundedYear - b.foundedYear) > FOUNDED_YEAR_TOLERANCE) {
    malus("different_founded_year", COMPANY_MALUS.different_founded_year, [String(a.foundedYear), String(b.foundedYear)]);
  }
  if (a.employees !== null && b.employees !== null && a.employees > EMPLOYEES_MIN && b.employees > EMPLOYEES_MIN && Math.max(a.employees, b.employees) / Math.min(a.employees, b.employees) > EMPLOYEES_RATIO) {
    malus("incompatible_employees", COMPANY_MALUS.incompatible_employees, [String(a.employees), String(b.employees)]);
  }
  if (differ(a.zip, b.zip) && (sameCountry || !a.country && !b.country)) {
    malus("different_zip", COMPANY_MALUS.different_zip, [a.zip, b.zip]);
  }
  if (differ(a.phoneTail, b.phoneTail)) malus("different_phone", COMPANY_MALUS.different_phone, [a.phoneTail, b.phoneTail]);
}
function scoreCompanyPair(a, b, rules = JIPUP_SCORE_RULES) {
  if (!a.name && a.domains.length === 0 || !b.name && b.domains.length === 0) return EMPTY_SCORE();
  if (parentSubsidiary(a, b)) return { ...EMPTY_SCORE(), excluded: "parent_subsidiary" };
  const sheet = scoreSheet(rules);
  const { hit } = sheet;
  const nameEq = Boolean(a.name && a.name === b.name);
  const nameFuzzy = fuzzyCompanyName(a.name, b.name);
  const sharedDomain = sharedValue(a.domains, b.domains);
  const sharedCore = sharedValue(a.domainCores, b.domainCores);
  const domEq = Boolean(sharedDomain);
  const coreEq = Boolean(sharedCore);
  const hasDomainA = a.domains.length > 0;
  const hasDomainB = b.domains.length > 0;
  if (a.siren && a.siren === b.siren) hit(COMPANY_BASE.same_siren, "same_siren", [a.siren]);
  if (domEq) hit(COMPANY_BASE.same_domain, "same_domain", [sharedDomain]);
  if (a.linkedin && a.linkedin === b.linkedin) {
    if (nameEq || nameFuzzy || domEq || coreEq) hit(COMPANY_BASE.same_linkedin_corroborated, "same_linkedin_corroborated", [a.linkedin]);
    else hit(COMPANY_BASE.same_linkedin_alone, "same_linkedin_alone", [a.linkedin]);
  }
  if (nameEq && coreEq) hit(COMPANY_BASE.same_name_domain_root, "same_name_domain_root", [a.name, sharedCore]);
  if (coreEq && !domEq) hit(COMPANY_BASE.same_domain_root_other_tld, "same_domain_root_other_tld", [sharedCore]);
  if (nameEq && a.city && a.city === b.city) hit(COMPANY_BASE.same_name_city, "same_name_city", [a.name, a.city]);
  if (nameFuzzy && domEq) hit(COMPANY_BASE.fuzzy_name_same_domain, "fuzzy_name_same_domain", [sharedDomain]);
  if ((!a.name || !b.name) && coreEq) hit(COMPANY_BASE.ghost_domain_root, "ghost_domain_root", [sharedCore]);
  if ((nameEq || nameFuzzy) && hasDomainA !== hasDomainB) {
    const code = nameEq ? "same_name_no_domain_one_side" : "fuzzy_name_no_domain_one_side";
    hit(COMPANY_BASE[code], code, [nameEq ? a.name : ""]);
  }
  if (nameEq && a.domainCore && b.domainCore && !coreEq)
    hit(COMPANY_BASE.same_name_different_roots, "same_name_different_roots", [a.name]);
  if (nameFuzzy && !coreEq && a.domainCore && b.domainCore && a.domainCore.length >= 4 && b.domainCore.length >= 4 && levenshtein(a.domainCore, b.domainCore, 1) <= 1) {
    hit(COMPANY_BASE.fuzzy_name_fuzzy_root, "fuzzy_name_fuzzy_root");
  }
  sheet.customIdentifiers(a.custom, b.custom);
  if (sheet.out.baseScore === 0) return sheet.settle();
  companyAdjustments(a, b, sheet);
  sheet.customAdjustments(a.custom, b.custom);
  return sheet.settle();
}
var NAME_BLOCK_RULES = ["same_name_city", "same_name_no_domain_one_side", "same_name_different_roots"];
var PREFIX_BLOCK_RULES = ["fuzzy_name_no_domain_one_side", "fuzzy_name_fuzzy_root"];
var needsBlock = (codes, off) => off.size === 0 || codes.some((c) => !off.has(c));
function companyKeys(c, nameBlocks) {
  const keys = [];
  for (const d of c.domains) keys.push(`de:${d}`);
  for (const d of c.domainCores) keys.push(`dc:${d}`);
  if (c.name && nameBlocks.nm) keys.push(`nm:${c.name}`);
  if (c.linkedin) keys.push(`li:${c.linkedin}`);
  if (c.siren) keys.push(`sr:${c.siren}`);
  if (c.name.length >= 5 && nameBlocks.np) keys.push(`np:${c.name.slice(0, 4)}`);
  return keys;
}
function companyBlockingKeys(c, rules = JIPUP_SCORE_RULES) {
  const keys = companyKeys(c, { nm: needsBlock(NAME_BLOCK_RULES, rules.off), np: needsBlock(PREFIX_BLOCK_RULES, rules.off) });
  if (rules.custom) keys.push(...customKeys(c.custom, rules));
  return keys;
}
function deletionVariants(name) {
  const out = /* @__PURE__ */ new Set([name]);
  if (name.length > 40) return [...out];
  for (let i = 0; i < name.length; i++) out.add(name.slice(0, i) + name.slice(i + 1));
  return [...out];
}
var DOMAIN_KEY = /^(de|dc):/;
function companyRefineKeys(key, c, rules = JIPUP_SCORE_RULES) {
  const domain = DOMAIN_KEY.test(key);
  const own = companyKeys(c, { nm: true, np: true });
  if (rules.custom) own.push(...customKeys(c.custom, rules));
  const out = own.filter((k) => k !== key && !(domain && DOMAIN_KEY.test(k)));
  if (key.startsWith("np:")) for (const v of deletionVariants(c.name)) out.push(`nd:${v}`);
  if (key.startsWith("nm:") && c.city) out.push(`ci:${c.city}`);
  return out;
}
var DEFAULT_MAX_BLOCK = 250;
function hashKey(str3) {
  let h1 = 3735928559;
  let h2 = 1103547991;
  for (let i = 0; i < str3.length; i++) {
    const ch = str3.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ h1 >>> 16, 2246822507);
  h1 ^= Math.imul(h2 ^ h2 >>> 13, 3266489909);
  h2 = Math.imul(h2 ^ h2 >>> 16, 2246822507);
  h2 ^= Math.imul(h1 ^ h1 >>> 13, 3266489909);
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}
function firstShared(x, y) {
  let p = 0;
  let q = 0;
  while (p < x.length && q < y.length) {
    if (x[p] === y[q]) return x[p];
    if (x[p] < y[q]) p++;
    else q++;
  }
  return -1;
}
var NO_REASONS = [];
function detectPairs(opts) {
  const maxBlock = opts.maxBlock ?? DEFAULT_MAX_BLOCK;
  const recs = opts.records;
  const bigNames = /* @__PURE__ */ new Map();
  const push = (map, key, i) => {
    const h = hashKey(key);
    const cur = map.get(h);
    if (cur === void 0) map.set(h, i);
    else if (typeof cur === "number") {
      if (cur !== i) map.set(h, [cur, i]);
    } else if (cur[cur.length - 1] !== i) {
      cur.push(i);
      if (cur.length === maxBlock + 1) bigNames.set(h, key);
    }
  };
  const sizeOf = (v) => v === void 0 ? 0 : typeof v === "number" ? 1 : v.length;
  const byKey = /* @__PURE__ */ new Map();
  recs.forEach((rec, i) => {
    for (const key of opts.keysOf(rec)) push(byKey, key, i);
  });
  const blocks = [];
  const bigBlocks = [];
  for (const [h, list] of byKey) {
    if (typeof list === "number") continue;
    if (list.length <= maxBlock) blocks.push(list);
    else bigBlocks.push({ key: bigNames.get(h), list });
  }
  for (const { key, list } of bigBlocks) {
    if (!opts.refineKeys) {
      opts.onBlockSkipped?.(key, list.length);
      continue;
    }
    opts.onBlockRefined?.(key, list.length);
    const refined = /* @__PURE__ */ new Map();
    for (const i of list) {
      for (const sub of opts.refineKeys(key, recs[i])) {
        const top = sizeOf(byKey.get(hashKey(sub)));
        if (top > 0 && (top <= maxBlock || sub < key)) continue;
        push(refined, `${key}|${sub}`, i);
      }
    }
    for (const [h, sub] of refined) {
      if (typeof sub === "number") continue;
      if (sub.length <= maxBlock) blocks.push(sub);
      else opts.onBlockSkipped?.(bigNames.get(h), sub.length);
    }
  }
  byKey.clear();
  const memberOf = recs.map(() => []);
  blocks.forEach((list, b) => {
    for (const i of list) {
      const m = memberOf[i];
      if (m[m.length - 1] !== b) m.push(b);
    }
  });
  const keepReasons = opts.keepReasons !== false;
  const pairs = [];
  for (let b = 0; b < blocks.length; b++) {
    const list = blocks[b];
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        const ia = list[i];
        const ib = list[j];
        if (ia === ib) continue;
        const a = recs[ia];
        const c = recs[ib];
        if (a.id === c.id) continue;
        if (firstShared(memberOf[ia], memberOf[ib]) !== b) continue;
        const { score, baseScore, reasons, excluded, malus } = opts.score(a, c);
        if (excluded) {
          opts.onPairExcluded?.(a, c, excluded);
          continue;
        }
        if ((baseScore ?? score) >= opts.minScore) {
          const nameContradiction2 = malus?.some((m) => NAME_MALUS.has(m.code));
          pairs.push({
            aId: a.id,
            bId: c.id,
            score,
            reasons: keepReasons ? reasons : NO_REASONS,
            ...nameContradiction2 ? { nameContradiction: true } : {}
          });
        }
      }
    }
  }
  return pairs;
}
var FREQ_GUARD_MIN_HOLDERS = 6;
var FREQ_GUARD_MIN_LABELS = 3;
var CONTACT_SIGNALS = [
  { prefix: "ln", get: (c) => [c.linkedin] },
  { prefix: "em", get: (c) => c.emails },
  { prefix: "ph", get: (c) => c.phoneTails }
];
var COMPANY_SIGNALS = [
  { prefix: "de", get: (c) => c.domains },
  { prefix: "dc", get: (c) => c.domainCores },
  { prefix: "li", get: (c) => [c.linkedin] },
  // A group's SIREN pasted on its subsidiaries, a placeholder typed everywhere.
  { prefix: "sr", get: (c) => [c.siren] }
];
function findDisqualified(records, fields, labelOf, minHolders, minLabels) {
  const out = [];
  for (const f of fields) {
    const holders = /* @__PURE__ */ new Map();
    for (const r of records) {
      for (const v of f.get(r)) {
        if (!v) continue;
        const list = holders.get(v);
        if (list) list.push(r);
        else holders.set(v, [r]);
      }
    }
    for (const [v, recs] of holders) {
      if (recs.length < minHolders) continue;
      const labels = new Set(recs.map(labelOf).filter(Boolean));
      if (labels.size >= minLabels) {
        out.push({ key: `${f.prefix}:${v}`, holders: recs.length, labels: labels.size });
      }
    }
  }
  return out;
}
function scrubContactSignals(c, keys) {
  if (keys.size === 0) return c;
  if (c.linkedin && keys.has(`ln:${c.linkedin}`)) c.linkedin = "";
  if (c.email && keys.has(`em:${c.email}`)) {
    c.email = "";
    c.emailLocal = "";
    c.emailLocalCore = "";
    c.emailDomain = "";
    c.emailDomainCore = "";
    c.emailDomainPublic = false;
  }
  c.emails = c.emails.filter((e) => !keys.has(`em:${e}`));
  if (c.mobileTail && keys.has(`ph:${c.mobileTail}`)) c.mobileTail = "";
  if (c.landlineTail && keys.has(`ph:${c.landlineTail}`)) c.landlineTail = "";
  c.phoneTails = c.phoneTails.filter((t) => !keys.has(`ph:${t}`));
  return c;
}
function scrubCompanySignals(c, keys) {
  if (keys.size === 0) return c;
  if (c.domain && keys.has(`de:${c.domain}`)) {
    c.domain = "";
    c.domainCore = "";
  }
  if (c.domainCore && keys.has(`dc:${c.domainCore}`)) c.domainCore = "";
  c.domains = c.domains.filter((d) => !keys.has(`de:${d}`));
  c.domainCores = c.domainCores.filter((d) => !keys.has(`dc:${d}`));
  if (c.linkedin && keys.has(`li:${c.linkedin}`)) c.linkedin = "";
  if (c.siren && keys.has(`sr:${c.siren}`)) c.siren = "";
  return c;
}
function normalizeRecord(object, rec, rules) {
  return object === "contact" ? normalizeContact(rec.id, rec.properties ?? {}, rules) : normalizeCompany(rec.id, rec.properties ?? {}, rules);
}
function detectNormalized(object, normed, opts) {
  const minHolders = opts?.minHolders ?? FREQ_GUARD_MIN_HOLDERS;
  const minLabels = opts?.minLabels ?? FREQ_GUARD_MIN_LABELS;
  const rules = customisedRules(opts?.scoreRules) ? opts.scoreRules : void 0;
  const refinedBlocks = [];
  const skippedBlocks = [];
  let excludedPairs = 0;
  const blockOpts = {
    maxBlock: opts?.maxBlock,
    keepReasons: opts?.keepReasons,
    onBlockRefined: (key, size) => refinedBlocks.push({ key, size }),
    onBlockSkipped: (key, size) => {
      skippedBlocks.push({ key, size });
      opts?.onBlockSkipped?.(key, size);
    },
    onPairExcluded: () => {
      excludedPairs++;
    }
  };
  if (object === "contact") {
    const contacts = normed;
    const disqualified2 = findDisqualified(
      contacts,
      CONTACT_SIGNALS,
      (c) => c.fullname,
      minHolders,
      minLabels
    );
    const keys2 = new Set(disqualified2.map((d) => d.key));
    for (const c of contacts) scrubContactSignals(c, keys2);
    const pairs2 = detectPairs({
      records: contacts,
      keysOf: rules ? (c) => contactBlockingKeys(c, rules) : contactBlockingKeys,
      refineKeys: rules ? (k, c) => contactRefineKeys(k, c, rules) : contactRefineKeys,
      score: rules ? (a, b) => scoreContactPair(a, b, rules) : scoreContactPair,
      minScore: MIN_SCORE_TO_CONSIDER.contact,
      ...blockOpts
    });
    return { pairs: pairs2, disqualified: disqualified2, refinedBlocks, skippedBlocks, excludedPairs };
  }
  const companies = normed;
  const disqualified = findDisqualified(
    companies,
    COMPANY_SIGNALS,
    (c) => c.name,
    minHolders,
    minLabels
  );
  const keys = new Set(disqualified.map((d) => d.key));
  for (const c of companies) scrubCompanySignals(c, keys);
  const pairs = detectPairs({
    records: companies,
    keysOf: rules ? (c) => companyBlockingKeys(c, rules) : companyBlockingKeys,
    refineKeys: rules ? (k, c) => companyRefineKeys(k, c, rules) : companyRefineKeys,
    score: rules ? (a, b) => scoreCompanyPair(a, b, rules) : scoreCompanyPair,
    minScore: MIN_SCORE_TO_CONSIDER.company,
    ...blockOpts
  });
  return { pairs, disqualified, refinedBlocks, skippedBlocks, excludedPairs };
}
function detectDuplicates(object, records, opts) {
  return detectNormalized(object, records.map((r) => normalizeRecord(object, r, opts?.scoreRules)), opts);
}

// engine/audit/checks/duplicates.ts
function affectedIds(pairs) {
  const ids = /* @__PURE__ */ new Set();
  for (const p of pairs) {
    ids.add(p.aId);
    ids.add(p.bId);
  }
  return ids;
}
function collectEvidence(ev, checkId, object, pairs, byId) {
  const sorted = [...pairs].sort((a, b) => b.score - a.score);
  for (const pair of sorted) {
    const a = byId.get(pair.aId);
    const b = byId.get(pair.bId);
    if (!a || !b) continue;
    ev.add(checkId, object, a, {
      duplicateOfId: b.id,
      duplicateOfName: nameOf(b, object),
      score: pair.score,
      reasons: pair.reasons
    });
  }
}
function runFor(object, records, ev, onBlockSkipped) {
  const checkId = object === "contact" ? "duplicates.contacts" : "duplicates.companies";
  const { pairs, disqualified } = detectDuplicates(object, records, { onBlockSkipped });
  for (const d of disqualified) {
    console.warn(
      `[audit] signal disqualified (${object}): ${d.key} \u2014 ${d.holders} records, ${d.labels} distinct names.`
    );
  }
  const byId = new Map(records.map((r) => [r.id, r]));
  collectEvidence(ev, checkId, object, pairs, byId);
  return {
    pairs,
    check: buildCheck({
      id: checkId,
      affected: affectedIds(pairs).size,
      total: records.length,
      meta: disqualified.length > 0 ? { pairs: pairs.length, disqualifiedSignals: disqualified.length } : { pairs: pairs.length }
    })
  };
}
function runDuplicates(ctx, ev) {
  const skippedBlocks = [];
  const onBlockSkipped = (key, size) => {
    skippedBlocks.push(`${key} (${size})`);
    console.warn(`[audit] duplicate block skipped \u2014 key too generic: ${key} (${size} records)`);
  };
  const contacts = runFor("contact", ctx.contacts, ev, onBlockSkipped);
  const companies = runFor("company", ctx.companies, ev, onBlockSkipped);
  const checks = [contacts.check, companies.check];
  if (skippedBlocks.length > 0) {
    checks[0].meta = {
      ...checks[0].meta ?? {},
      skippedBlocks: skippedBlocks.length
    };
  }
  return {
    checks,
    findings: [],
    totals: {
      contactPairs: contacts.pairs.length,
      companyPairs: companies.pairs.length,
      affectedContactIds: affectedIds(contacts.pairs),
      affectedCompanies: affectedIds(companies.pairs).size,
      affectedCompanyIds: affectedIds(companies.pairs)
    }
  };
}

// engine/audit/checks/pipeline.ts
var CHECK_IDS = [
  "pipeline.deal.overdue",
  "pipeline.deal.stalled",
  "pipeline.deal.noAmount",
  "pipeline.deal.noContact"
];
function isOpen(rec, ctx) {
  if (ctx.dealProps.has("hs_is_closed")) return !bool(rec, "hs_is_closed");
  const stage = prop(rec, "dealstage").toLowerCase();
  return !stage.includes("closed") && !stage.includes("won") && !stage.includes("lost");
}
function runPipeline(ctx, ev) {
  if (!ctx.capabilities.has("deals")) {
    return {
      checks: CHECK_IDS.map((id) => skippedCheck(id, "missing_scope")),
      findings: [],
      skipped: "missing_scope",
      requiredScope: CAPABILITY_SCOPES.deals
    };
  }
  const open = ctx.deals.filter((d) => isOpen(d, ctx));
  const checks = [];
  if (!ctx.dealProps.has("closedate")) {
    checks.push(skippedCheck("pipeline.deal.overdue", "missing_property", 3));
  } else {
    let overdue = 0;
    let dated = 0;
    for (const rec of open) {
      const close = dateProp(rec, "closedate");
      if (close === null) continue;
      dated++;
      if (close >= ctx.now) continue;
      overdue++;
      ev.add("pipeline.deal.overdue", "deal", rec, {
        closeDate: new Date(close).toISOString(),
        daysOverdue: Math.round(daysSince(close, ctx.now)),
        amount: prop(rec, "amount") || null
      });
    }
    checks.push(
      buildCheck({ id: "pipeline.deal.overdue", affected: overdue, total: dated, weight: 3 })
    );
  }
  const activityProps = ["hs_lastmodifieddate", "notes_last_updated"].filter(
    (p) => ctx.dealProps.has(p)
  );
  if (activityProps.length === 0) {
    checks.push(skippedCheck("pipeline.deal.stalled", "missing_property", 3));
  } else {
    let stalled = 0;
    let dated = 0;
    for (const rec of open) {
      const timestamps = activityProps.map((p) => dateProp(rec, p)).filter((t) => t !== null);
      if (timestamps.length === 0) continue;
      dated++;
      const days = daysSince(Math.max(...timestamps), ctx.now);
      if (days < ZOMBIE_DEAL_DAYS) continue;
      stalled++;
      ev.add("pipeline.deal.stalled", "deal", rec, {
        idleDays: Math.round(days),
        amount: prop(rec, "amount") || null
      });
    }
    checks.push(
      buildCheck({
        id: "pipeline.deal.stalled",
        affected: stalled,
        total: dated,
        weight: 3,
        meta: { days: ZOMBIE_DEAL_DAYS }
      })
    );
  }
  if (!ctx.dealProps.has("amount")) {
    checks.push(skippedCheck("pipeline.deal.noAmount", "missing_property", 2));
  } else {
    let noAmount = 0;
    for (const rec of open) {
      if (filled(rec, "amount") && num(rec, "amount") > 0) continue;
      noAmount++;
      ev.add("pipeline.deal.noAmount", "deal", rec);
    }
    checks.push(
      buildCheck({ id: "pipeline.deal.noAmount", affected: noAmount, total: open.length, weight: 2 })
    );
  }
  if (!ctx.dealProps.has("num_associated_contacts")) {
    checks.push(skippedCheck("pipeline.deal.noContact", "missing_property", 2));
  } else {
    let noContact = 0;
    for (const rec of open) {
      if (num(rec, "num_associated_contacts") > 0) continue;
      noContact++;
      ev.add("pipeline.deal.noContact", "deal", rec);
    }
    checks.push(
      buildCheck({
        id: "pipeline.deal.noContact",
        affected: noContact,
        total: open.length,
        weight: 2
      })
    );
  }
  return { checks, findings: [] };
}

// engine/audit/checks/quality.ts
var ISO2_TO_NAME = {
  fr: "france",
  be: "belgique",
  ch: "suisse",
  lu: "luxembourg",
  de: "allemagne",
  es: "espagne",
  it: "italie",
  pt: "portugal",
  nl: "pays bas",
  gb: "royaume uni",
  uk: "royaume uni",
  ie: "irlande",
  us: "etats unis",
  ca: "canada",
  ma: "maroc",
  tn: "tunisie",
  dz: "algerie",
  sn: "senegal",
  ci: "cote d ivoire",
  pl: "pologne",
  se: "suede",
  dk: "danemark",
  no: "norvege",
  fi: "finlande",
  at: "autriche",
  au: "australie",
  br: "bresil",
  in: "inde",
  cn: "chine",
  jp: "japon"
};
var COUNTRY_ALIASES = {
  usa: "etats unis",
  "u s a": "etats unis",
  "united states": "etats unis",
  "united states of america": "etats unis",
  "etats unis d amerique": "etats unis",
  "united kingdom": "royaume uni",
  "great britain": "royaume uni",
  england: "royaume uni",
  angleterre: "royaume uni",
  germany: "allemagne",
  deutschland: "allemagne",
  spain: "espagne",
  espana: "espagne",
  italy: "italie",
  italia: "italie",
  netherlands: "pays bas",
  holland: "pays bas",
  belgium: "belgique",
  switzerland: "suisse",
  schweiz: "suisse",
  portugal: "portugal",
  ireland: "irlande",
  morocco: "maroc",
  tunisia: "tunisie",
  algeria: "algerie"
};
function countryKey(raw) {
  const normalized = normName(raw);
  if (!normalized) return "";
  if (normalized.length === 2 && ISO2_TO_NAME[normalized]) {
    return ISO2_TO_NAME[normalized];
  }
  return COUNTRY_ALIASES[normalized] ?? normalized;
}
var DOMAIN_SHAPE = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/;
function countryConsistency(ctx, ev) {
  const id = "quality.country.inconsistent";
  if (!ctx.companyProps.has("country")) {
    return skippedCheck(id, "missing_property");
  }
  const groups = /* @__PURE__ */ new Map();
  for (const rec of ctx.companies) {
    const raw = prop(rec, "country");
    if (!raw) continue;
    const key = countryKey(raw);
    if (!key) continue;
    const spellings = groups.get(key) ?? /* @__PURE__ */ new Map();
    spellings.set(raw, (spellings.get(raw) ?? 0) + 1);
    groups.set(key, spellings);
  }
  const canonical = /* @__PURE__ */ new Map();
  let variantSpellings = 0;
  for (const [key, spellings] of groups) {
    const best = [...spellings.entries()].sort(
      (a, b) => b[1] - a[1] || a[0].localeCompare(b[0])
    )[0][0];
    canonical.set(key, best);
    variantSpellings += spellings.size - 1;
  }
  let affected = 0;
  let total = 0;
  for (const rec of ctx.companies) {
    const raw = prop(rec, "country");
    if (!raw) continue;
    total++;
    const key = countryKey(raw);
    const best = canonical.get(key);
    if (best && best !== raw) {
      affected++;
      ev.add(id, "company", rec, { value: raw, canonical: best });
    }
  }
  return buildCheck({
    id,
    affected,
    total,
    meta: { distinctCountries: groups.size, variantSpellings }
  });
}
function runQuality(ctx, ev) {
  const checks = [];
  if (ctx.contactProps.has("email")) {
    let invalid = 0;
    let typo = 0;
    let role = 0;
    let free = 0;
    let withEmail = 0;
    for (const rec of ctx.contacts) {
      const email = prop(rec, "email").toLowerCase();
      if (!email) continue;
      withEmail++;
      if (isStructurallyInvalidEmail(email)) {
        invalid++;
        ev.add("quality.email.invalid", "contact", rec, { email });
        continue;
      }
      const domain = emailDomain2(email);
      const local = emailLocal(email);
      const intended = TYPO_DOMAINS[domain];
      if (intended) {
        typo++;
        ev.add("quality.email.typo", "contact", rec, { email, suggestion: intended });
      }
      if (ROLE_EMAIL_LOCALS.has(local)) {
        role++;
        ev.add("quality.email.role", "contact", rec, { email });
      }
      if (FREE_EMAIL_DOMAINS.has(domain)) {
        free++;
        ev.add("quality.email.free", "contact", rec, { email, domain });
      }
    }
    checks.push(
      buildCheck({ id: "quality.email.invalid", affected: invalid, total: withEmail, weight: 3 }),
      buildCheck({ id: "quality.email.typo", affected: typo, total: withEmail, weight: 3 }),
      buildCheck({ id: "quality.email.role", affected: role, total: withEmail, weight: 2 }),
      buildCheck({ id: "quality.email.free", affected: free, total: withEmail, weight: 1 })
    );
  } else {
    checks.push(
      skippedCheck("quality.email.invalid", "missing_property", 3),
      skippedCheck("quality.email.typo", "missing_property", 3),
      skippedCheck("quality.email.role", "missing_property", 2),
      skippedCheck("quality.email.free", "missing_property", 1)
    );
  }
  const phoneProps = ["phone", "mobilephone"].filter((p) => ctx.contactProps.has(p));
  if (phoneProps.length > 0) {
    let badPhone = 0;
    let withPhone = 0;
    for (const rec of ctx.contacts) {
      const raw = firstFilled(rec, ...phoneProps);
      if (!raw) continue;
      withPhone++;
      if (!isPlausiblePhone(raw)) {
        badPhone++;
        ev.add("quality.phone.format", "contact", rec, { phone: raw });
      }
    }
    checks.push(
      buildCheck({ id: "quality.phone.format", affected: badPhone, total: withPhone, weight: 2 })
    );
  } else {
    checks.push(skippedCheck("quality.phone.format", "missing_property", 2));
  }
  if (ctx.contactProps.has("firstname") || ctx.contactProps.has("lastname")) {
    let badCasing = 0;
    let named = 0;
    for (const rec of ctx.contacts) {
      const full = `${prop(rec, "firstname")} ${prop(rec, "lastname")}`.trim();
      if (!full) continue;
      named++;
      if (hasBadCasing(full)) {
        badCasing++;
        ev.add("quality.name.casing", "contact", rec, { name: full });
      }
    }
    checks.push(
      buildCheck({ id: "quality.name.casing", affected: badCasing, total: named, weight: 1 })
    );
  } else {
    checks.push(skippedCheck("quality.name.casing", "missing_property", 1));
  }
  if (ctx.companyProps.has("domain") || ctx.companyProps.has("website")) {
    let badDomain = 0;
    let withDomain = 0;
    for (const rec of ctx.companies) {
      const raw = firstFilled(rec, "domain", "website");
      if (!raw) continue;
      withDomain++;
      const normalized = normDomain(raw);
      if (!normalized || !DOMAIN_SHAPE.test(normalized)) {
        badDomain++;
        ev.add("quality.company.domain", "company", rec, { value: raw });
      }
    }
    checks.push(
      buildCheck({ id: "quality.company.domain", affected: badDomain, total: withDomain, weight: 2 })
    );
  } else {
    checks.push(skippedCheck("quality.company.domain", "missing_property", 2));
  }
  if (ctx.companyProps.has("name")) {
    let placeholder = 0;
    let named = 0;
    for (const rec of ctx.companies) {
      if (!filled(rec, "name")) continue;
      named++;
      const name = prop(rec, "name");
      if (/^https?:\/\//i.test(name) || /^[a-z0-9-]+\.[a-z]{2,}$/i.test(name)) {
        placeholder++;
        ev.add("quality.company.placeholderName", "company", rec, { name });
      }
    }
    checks.push(
      buildCheck({
        id: "quality.company.placeholderName",
        affected: placeholder,
        total: named,
        weight: 1
      })
    );
  } else {
    checks.push(skippedCheck("quality.company.placeholderName", "missing_property", 1));
  }
  checks.push(countryConsistency(ctx, ev));
  return { checks, findings: [] };
}

// engine/audit/checks/schema-debt.ts
function propertySignature(name) {
  const cleaned = name.toLowerCase().replace(/^(hs_|n\d+_|custom_|c_)/, "").replace(/\d+/g, " ").replace(/[^a-z]+/g, " ").trim();
  const tokens = cleaned.split(/\s+/).filter((t) => t.length > 2);
  return tokens.sort().join("_");
}
function runSchemaDebt(ctx, ev) {
  if (!ctx.capabilities.has("schemas")) {
    return {
      checks: [
        skippedCheck("schemaDebt.ghostProperties", "missing_scope", 3),
        skippedCheck("schemaDebt.redundantProperties", "missing_scope", 2)
      ],
      findings: [],
      skipped: "missing_scope",
      requiredScope: CAPABILITY_SCOPES.schemas
    };
  }
  const checks = [];
  const sample = ctx.schemaSample;
  if (ctx.customContactProps.length === 0 || sample.length === 0) {
    checks.push(skippedCheck("schemaDebt.ghostProperties", "no_data", 3));
  } else {
    let ghosts = 0;
    for (const name of ctx.customContactProps) {
      let hits = 0;
      for (const rec of sample) if (filled(rec, name)) hits++;
      const fillRatio = hits / sample.length;
      if (fillRatio >= GHOST_PROPERTY_FILL_RATIO) continue;
      ghosts++;
      ev.addRaw({
        checkId: "schemaDebt.ghostProperties",
        objectType: "contact",
        objectId: name,
        objectName: name,
        detail: {
          fillRatio: Number(fillRatio.toFixed(4)),
          filledInSample: hits,
          sampleSize: sample.length
        }
      });
    }
    checks.push(
      buildCheck({
        id: "schemaDebt.ghostProperties",
        affected: ghosts,
        total: ctx.customContactProps.length,
        weight: 3,
        sampled: true,
        sampleSize: sample.length,
        meta: { thresholdPct: GHOST_PROPERTY_FILL_RATIO * 100 }
      })
    );
  }
  const allCustom = [
    ...ctx.customContactProps.map((name) => ({ name, object: "contact" })),
    ...ctx.customCompanyProps.map((name) => ({ name, object: "company" }))
  ];
  if (allCustom.length === 0) {
    checks.push(skippedCheck("schemaDebt.redundantProperties", "no_data", 2));
  } else {
    const groups = /* @__PURE__ */ new Map();
    for (const entry of allCustom) {
      const sig = propertySignature(entry.name);
      if (!sig) continue;
      const key = `${entry.object}:${sig}`;
      const list = groups.get(key) ?? [];
      list.push(entry);
      groups.set(key, list);
    }
    let redundant = 0;
    for (const key of [...groups.keys()].sort()) {
      const list = groups.get(key);
      if (list.length < 2) continue;
      redundant += list.length;
      ev.addRaw({
        checkId: "schemaDebt.redundantProperties",
        objectType: list[0].object,
        objectId: key,
        objectName: list.map((p) => p.name).join(" / "),
        detail: { properties: list.map((p) => p.name) }
      });
    }
    checks.push(
      buildCheck({
        id: "schemaDebt.redundantProperties",
        affected: redundant,
        total: allCustom.length,
        weight: 2
      })
    );
  }
  return { checks, findings: [] };
}

// engine/audit/checks/staleness.ts
function employmentReferenceKind(ctx) {
  return canSeeActivity(ctx) ? "activity" : "modified";
}
function employmentReference(rec, ctx, kind = employmentReferenceKind(ctx)) {
  const created = dateProp(rec, "createdate");
  if (kind === "modified") return dateProp(rec, "lastmodifieddate") ?? created;
  const activity = lastActivityAt(rec, ctx);
  if (activity === null) return created;
  return created === null ? activity : Math.max(activity, created);
}
function obsolescenceProbability(months) {
  if (months <= 0) return 0;
  const p = 1 - Math.pow(1 - MONTHLY_JOB_TURNOVER, months);
  return Math.min(MAX_STALE_PROBABILITY, p);
}
function runStaleness(ctx, ev) {
  const hasEmployment = ctx.contactProps.has("jobtitle") || ctx.contactProps.has("company") || ctx.contactProps.has("associatedcompanyid");
  const hasDates = ctx.contactProps.has("lastmodifieddate") || ctx.contactProps.has("createdate");
  if (!hasEmployment || !hasDates) {
    return {
      checks: [
        skippedCheck("staleness.contact.likelyObsolete", "missing_property", 3),
        skippedCheck("staleness.contact.atRisk", "missing_property", 2)
      ],
      findings: [],
      totals: { likelyObsolete: 0, atRiskIds: /* @__PURE__ */ new Set() }
    };
  }
  let tracked = 0;
  const atRiskIds = /* @__PURE__ */ new Set();
  let expectedObsolete = 0;
  const reference = employmentReferenceKind(ctx);
  for (const rec of ctx.contacts) {
    const hasJobData = filled(rec, "jobtitle") || filled(rec, "company") || filled(rec, "associatedcompanyid");
    if (!hasJobData) continue;
    const since = employmentReference(rec, ctx, reference);
    if (since === null) continue;
    tracked++;
    const months = monthsSince(since, ctx.now);
    expectedObsolete += obsolescenceProbability(months);
    if (months >= STALE_MONTHS) {
      atRiskIds.add(rec.id);
      ev.add("staleness.contact.atRisk", "contact", rec, {
        lastTouched: new Date(since).toISOString(),
        monthsSince: Math.round(months)
      });
    }
  }
  const likelyObsolete = Math.round(expectedObsolete);
  const checks = [
    buildCheck({
      id: "staleness.contact.likelyObsolete",
      affected: likelyObsolete,
      total: tracked,
      weight: 3,
      meta: {
        // Printed verbatim in the report so the number is never a black box.
        estimate: true,
        assumptionAnnualTurnoverPct: Math.round(ANNUAL_JOB_TURNOVER * 100),
        maxProbabilityPerContact: MAX_STALE_PROBABILITY,
        reference
      }
    }),
    buildCheck({
      id: "staleness.contact.atRisk",
      affected: atRiskIds.size,
      total: tracked,
      weight: 2,
      meta: { months: STALE_MONTHS, reference }
    })
  ];
  return { checks, findings: [], totals: { likelyObsolete, atRiskIds } };
}

// engine/audit/checks/structure.ts
function runStructure(ctx, ev) {
  const checks = [];
  if (ctx.contactProps.has("associatedcompanyid")) {
    let orphans = 0;
    for (const rec of ctx.contacts) {
      if (filled(rec, "associatedcompanyid")) continue;
      orphans++;
      ev.add("structure.contact.noCompany", "contact", rec);
    }
    checks.push(
      buildCheck({
        id: "structure.contact.noCompany",
        affected: orphans,
        total: ctx.contacts.length,
        weight: 3
      })
    );
  } else {
    checks.push(skippedCheck("structure.contact.noCompany", "missing_property", 3));
  }
  if (ctx.companyProps.has("num_associated_contacts")) {
    let empty = 0;
    for (const rec of ctx.companies) {
      if (Number(prop(rec, "num_associated_contacts")) > 0) continue;
      empty++;
      ev.add("structure.company.noContact", "company", rec);
    }
    checks.push(
      buildCheck({
        id: "structure.company.noContact",
        affected: empty,
        total: ctx.companies.length,
        weight: 2
      })
    );
  } else {
    checks.push(skippedCheck("structure.company.noContact", "missing_property", 2));
  }
  const contactsHaveOwner = ctx.contactProps.has("hubspot_owner_id");
  const companiesHaveOwner = ctx.companyProps.has("hubspot_owner_id");
  if (contactsHaveOwner) {
    let unowned = 0;
    for (const rec of ctx.contacts) {
      if (filled(rec, "hubspot_owner_id")) continue;
      unowned++;
      ev.add("structure.contact.noOwner", "contact", rec);
    }
    checks.push(
      buildCheck({
        id: "structure.contact.noOwner",
        affected: unowned,
        total: ctx.contacts.length,
        weight: 2
      })
    );
  } else {
    checks.push(skippedCheck("structure.contact.noOwner", "missing_property", 2));
  }
  if (companiesHaveOwner) {
    let unowned = 0;
    for (const rec of ctx.companies) {
      if (filled(rec, "hubspot_owner_id")) continue;
      unowned++;
      ev.add("structure.company.noOwner", "company", rec);
    }
    checks.push(
      buildCheck({
        id: "structure.company.noOwner",
        affected: unowned,
        total: ctx.companies.length,
        weight: 1
      })
    );
  } else {
    checks.push(skippedCheck("structure.company.noOwner", "missing_property", 1));
  }
  const active = ctx.activeOwnerIds;
  if (!active) {
    checks.push(skippedCheck("structure.owner.inactive", "missing_scope", 3));
  } else if (!contactsHaveOwner && !companiesHaveOwner) {
    checks.push(skippedCheck("structure.owner.inactive", "missing_property", 3));
  } else {
    let orphaned = 0;
    let owned = 0;
    const scan = (records, object) => {
      for (const rec of records) {
        const ownerId = prop(rec, "hubspot_owner_id");
        if (!ownerId) continue;
        owned++;
        if (active.has(ownerId)) continue;
        orphaned++;
        ev.add("structure.owner.inactive", object, rec, { ownerId });
      }
    };
    if (contactsHaveOwner) scan(ctx.contacts, "contact");
    if (companiesHaveOwner) scan(ctx.companies, "company");
    checks.push(
      buildCheck({
        id: "structure.owner.inactive",
        affected: orphaned,
        total: owned,
        weight: 3,
        meta: { activeOwners: active.size }
      })
    );
  }
  const skippedForScope = checks.every((c) => c.skipped === "missing_scope");
  return {
    checks,
    findings: [],
    ...skippedForScope ? { skipped: "missing_scope", requiredScope: CAPABILITY_SCOPES.owners } : {}
  };
}

// engine/audit/sources.ts
var JIPUP_HUBSPOT_APP_IDS = /* @__PURE__ */ new Set(["36948127"]);
var RECORD_SOURCES = [
  "import",
  "jipup",
  "integration",
  "manual",
  "api",
  "inbound",
  "other",
  "unknown"
];
function canSeeSource(props) {
  return props.has("hs_analytics_source");
}
function recordSource(rec) {
  const source = prop(rec, "hs_analytics_source").toUpperCase();
  if (!source) return "unknown";
  if (source !== "OFFLINE") return "inbound";
  switch (prop(rec, "hs_analytics_source_data_1").toUpperCase()) {
    case "IMPORT":
      return "import";
    case "INTEGRATION":
      return JIPUP_HUBSPOT_APP_IDS.has(prop(rec, "hs_analytics_source_data_2")) ? "jipup" : "integration";
    case "CRM_UI":
      return "manual";
    case "API":
      return "api";
    default:
      return "other";
  }
}
function countBySource(records) {
  const counts = /* @__PURE__ */ new Map();
  for (const rec of records) {
    const s = recordSource(rec);
    counts.set(s, (counts.get(s) ?? 0) + 1);
  }
  const out = {};
  for (const s of RECORD_SOURCES) {
    const n = counts.get(s);
    if (n) out[s] = n;
  }
  return out;
}
function buildSources(ctx) {
  return {
    contacts: canSeeSource(ctx.contactProps) ? countBySource(ctx.contacts) : null,
    companies: canSeeSource(ctx.companyProps) ? countBySource(ctx.companies) : null
  };
}
function buildNewContacts(ctx, activableIds) {
  if (!activableIds || !ctx.contactProps.has("createdate")) return null;
  const recent = ctx.contacts.filter((r) => {
    const created = dateProp(r, "createdate");
    return created !== null && created <= ctx.now && daysSince(created, ctx.now) <= NEW_RECORDS_WINDOW_DAYS;
  });
  const activable = recent.filter((r) => activableIds.has(r.id));
  let bySource = null;
  if (canSeeSource(ctx.contactProps)) {
    const all = countBySource(recent);
    const ok = countBySource(activable);
    bySource = RECORD_SOURCES.filter((s) => all[s]).map((s) => ({
      source: s,
      contacts: all[s],
      activable: ok[s] ?? 0
    }));
  }
  return {
    windowDays: NEW_RECORDS_WINDOW_DAYS,
    contacts: recent.length,
    activable: activable.length,
    bySource
  };
}

// engine/audit/checks/unscored.ts
var UNSCORED_WEIGHT = 0;
function isRecentInbound(rec, ctx) {
  if (recordSource(rec) !== "inbound") return false;
  const created = dateProp(rec, "createdate");
  if (created === null) return false;
  const age = daysSince(created, ctx.now);
  return age >= UNTREATED_LEAD_MIN_DAYS && age <= UNTREATED_LEAD_MAX_DAYS;
}
function humanActivityAt(rec) {
  const ts = ["notes_last_contacted", "notes_last_updated"].map((p) => dateProp(rec, p)).filter((t) => t !== null);
  return ts.length ? Math.max(...ts) : null;
}
function untreatedReasons(rec, ctx) {
  const reasons = [];
  const owner = prop(rec, "hubspot_owner_id");
  const active = ctx.activeOwnerIds;
  if (ctx.contactProps.has("hubspot_owner_id") && (!owner || active !== null && !active.has(owner)))
    reasons.push("owner");
  if (canSeeActivity(ctx) && humanActivityAt(rec) === null) reasons.push("activity");
  return reasons;
}
function untreatedLeads(ctx, ev) {
  const id = "freshness.contact.untreatedLeads";
  if (!canSeeSource(ctx.contactProps) || !ctx.contactProps.has("createdate"))
    return skippedCheck(id, "missing_property", UNSCORED_WEIGHT);
  let total = 0;
  let affected = 0;
  for (const rec of ctx.contacts) {
    if (!isRecentInbound(rec, ctx)) continue;
    total++;
    const missing = untreatedReasons(rec, ctx);
    if (missing.length === 0) continue;
    affected++;
    ev.add(id, "contact", rec, { missing });
  }
  return buildCheck({ id, affected, total, weight: UNSCORED_WEIGHT });
}
function isCustomerCompany(rec) {
  return num(rec, "total_revenue") > 0 || prop(rec, "lifecyclestage").toLowerCase() === "customer";
}
function canCountAccountContacts(ctx) {
  return ctx.companyProps.has("num_associated_contacts") && (ctx.companyProps.has("total_revenue") || ctx.companyProps.has("lifecyclestage"));
}
function isThinCustomerAccount(rec) {
  return isCustomerCompany(rec) && num(rec, "num_associated_contacts") <= 1;
}
function singleContactCustomers(ctx, ev) {
  const id = "structure.company.singleContactCustomers";
  if (!canCountAccountContacts(ctx)) return skippedCheck(id, "missing_property", UNSCORED_WEIGHT);
  let total = 0;
  let affected = 0;
  for (const rec of ctx.companies) {
    if (!isCustomerCompany(rec)) continue;
    total++;
    if (!isThinCustomerAccount(rec)) continue;
    affected++;
    ev.add(id, "company", rec, { missing: [num(rec, "num_associated_contacts") === 0 ? "noContact" : "oneContact"] });
  }
  return buildCheck({ id, affected, total, weight: UNSCORED_WEIGHT });
}
var FR_NAMES = new Intl.DisplayNames(["fr"], { type: "region" });
var EN_NAMES = new Intl.DisplayNames(["en"], { type: "region" });
function namesOf(code) {
  return [FR_NAMES.of(code) ?? code, EN_NAMES.of(code) ?? code];
}
var PLACE_COUNTRY = {
  paris: "FR",
  "ile de france": "FR",
  "greater paris metropolitan region": "FR",
  "paris area": "FR",
  "region de paris": "FR",
  lyon: "FR",
  "greater lyon area": "FR",
  marseille: "FR",
  toulouse: "FR",
  bordeaux: "FR",
  lille: "FR",
  nantes: "FR",
  "auvergne rhone alpes": "FR",
  "provence alpes cote d azur": "FR",
  occitanie: "FR",
  "nouvelle aquitaine": "FR",
  "hauts de france": "FR",
  bretagne: "FR",
  normandie: "FR",
  "grand est": "FR",
  "pays de la loire": "FR",
  london: "GB",
  "greater london": "GB",
  "new york": "US",
  "new york city metropolitan area": "US",
  "san francisco bay area": "US",
  brussels: "BE",
  bruxelles: "BE",
  geneve: "CH",
  geneva: "CH",
  "greater madrid metropolitan area": "ES",
  madrid: "ES",
  barcelona: "ES",
  berlin: "DE",
  amsterdam: "NL"
};
function placeKey(v) {
  return v.normalize("NFD").replace(new RegExp("\\p{M}", "gu"), "").toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();
}
function countryCodeOf(raw) {
  const direct = normCountry(raw);
  if (direct) return direct;
  const parts = raw.split(/[,/|;]/).map((p) => p.trim()).filter(Boolean);
  for (let i = parts.length - 1; i >= 0; i--) {
    const code = normCountry(parts[i]);
    if (code) return code;
  }
  for (const part of [raw, ...parts]) {
    const code = PLACE_COUNTRY[placeKey(part)];
    if (code) return code;
  }
  return "";
}
function judgeCountries(records) {
  const coded = [];
  for (const rec of records) {
    const raw = prop(rec, "country");
    if (!raw) continue;
    const code = countryCodeOf(raw);
    if (code) coded.push({ rec, raw, code });
  }
  const clean = /* @__PURE__ */ new Map();
  let fr = 0;
  let en = 0;
  for (const { raw, code } of coded) {
    const [frName, enName] = namesOf(code);
    if (raw !== frName && raw !== enName) continue;
    const spellings = clean.get(code) ?? /* @__PURE__ */ new Map();
    spellings.set(raw, (spellings.get(raw) ?? 0) + 1);
    clean.set(code, spellings);
    if (frName !== enName) raw === frName ? fr++ : en++;
  }
  const preferEnglish = en > fr;
  const target = (code) => {
    const spellings = clean.get(code);
    if (spellings)
      return [...spellings.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0][0];
    const [frName, enName] = namesOf(code);
    return preferEnglish ? enName : frName;
  };
  const fixes = /* @__PURE__ */ new Map();
  for (const { rec, raw, code } of coded) {
    const [frName, enName] = namesOf(code);
    if (raw === frName || raw === enName) continue;
    fixes.set(rec.id, target(code));
  }
  return { total: coded.length, fixes };
}
function countryCheck(id, object, records, props, ev) {
  if (!props.has("country")) return skippedCheck(id, "missing_property", UNSCORED_WEIGHT);
  const { total, fixes } = judgeCountries(records);
  for (const rec of records) {
    const canonical = fixes.get(rec.id);
    if (canonical) ev.add(id, object, rec, { value: prop(rec, "country"), canonical });
  }
  return buildCheck({ id, affected: fixes.size, total, weight: UNSCORED_WEIGHT });
}
function runUnscored(ctx, ev) {
  return {
    freshness: [untreatedLeads(ctx, ev)],
    structure: [singleContactCustomers(ctx, ev)],
    quality: [
      countryCheck("quality.contact.country", "contact", ctx.contacts, ctx.contactProps, ev),
      countryCheck("quality.company.country", "company", ctx.companies, ctx.companyProps, ev)
    ]
  };
}

// engine/audit/activation.ts
function hasUsableEmail(rec, input) {
  const email = prop(rec, "email").toLowerCase();
  if (!email || isStructurallyInvalidEmail(email)) return false;
  return !(input.hardBouncedIds.has(rec.id) || input.ghostIds.has(rec.id) || input.optedOutIds.has(rec.id));
}
function failingCriteria(rec, ctx, input) {
  const active = ctx.activeOwnerIds;
  const ownerId = prop(rec, "hubspot_owner_id");
  const failing = [];
  if (!hasUsableEmail(rec, input)) failing.push("email");
  if (!filled(rec, "associatedcompanyid")) failing.push("company");
  if (!filled(rec, "jobtitle")) failing.push("jobTitle");
  if (!ownerId || active && !active.has(ownerId)) failing.push("owner");
  return failing;
}
function activableContactIds(ctx, input) {
  if (!ctx.contactProps.has("email") || ctx.contacts.length === 0) return null;
  const ids = /* @__PURE__ */ new Set();
  for (const rec of ctx.contacts) {
    if (failingCriteria(rec, ctx, input).length === 0) ids.add(rec.id);
  }
  return ids;
}
function buildActivation(ctx, input) {
  if (!ctx.contactProps.has("email") || ctx.contacts.length === 0) return null;
  const ownerRule = ctx.activeOwnerIds ? "active" : "assigned";
  const phoneProps = ["phone", "mobilephone"].filter((p) => ctx.contactProps.has(p));
  const missing = { email: 0, company: 0, jobTitle: 0, owner: 0 };
  const oneAway = { email: 0, company: 0, jobTitle: 0, owner: 0 };
  let activable = 0;
  let callable = 0;
  let unreachable = 0;
  for (const rec of ctx.contacts) {
    const failing = failingCriteria(rec, ctx, input);
    const email = !failing.includes("email");
    const phone = phoneProps.some((p) => filled(rec, p));
    if (!email && !phone) unreachable++;
    for (const c of failing) missing[c]++;
    if (failing.length === 1) oneAway[failing[0]]++;
    if (failing.length > 0) continue;
    activable++;
    if (phone) callable++;
  }
  return {
    contacts: ctx.contacts.length,
    activable,
    callable,
    unreachable,
    ownerRule,
    missing,
    oneAway
  };
}

// engine/audit/markets.ts
function host(v) {
  if (!v) return "";
  return v.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").split(/[/?#]/)[0];
}
function buildMarkets(ctx) {
  let located = 0;
  let french = 0;
  for (const c of ctx.companies) {
    const country = normCountry(c.properties?.country);
    if (country) {
      located++;
      if (country === "FR") french++;
      continue;
    }
    const domain = host(c.properties?.domain) || host(c.properties?.website);
    if (domain.endsWith(".fr")) {
      located++;
      french++;
    }
  }
  return {
    companies: ctx.companies.length,
    located,
    french,
    frenchShare: located ? french / located : null
  };
}

// engine/audit/customers.ts
function detectCustomers(ctx) {
  const byLifecycle = ctx.contactProps.has("lifecyclestage");
  const byRevenue = ctx.companyProps.has("total_revenue") && ctx.contactProps.has("associatedcompanyid");
  const revenueCompanies = /* @__PURE__ */ new Set();
  if (byRevenue) {
    for (const company of ctx.companies) {
      if (num(company, "total_revenue") > 0) revenueCompanies.add(company.id);
    }
  }
  return { byLifecycle, byRevenue, revenueCompanies };
}
function canDetectCustomers(d) {
  return d.byLifecycle || d.byRevenue;
}
function customerSource(rec, d) {
  const lifecycle2 = d.byLifecycle && prop(rec, "lifecyclestage").toLowerCase() === "customer";
  const companyId = d.byRevenue ? prop(rec, "associatedcompanyid") : "";
  const revenue = companyId !== "" && d.revenueCompanies.has(companyId);
  if (lifecycle2 && revenue) return "both";
  if (lifecycle2) return "lifecycle";
  if (revenue) return "revenue";
  return null;
}
function championPredicate(ctx) {
  const detection = detectCustomers(ctx);
  if (!canDetectCustomers(detection)) return null;
  return (rec) => detection.byLifecycle && CHAMPION_LIFECYCLE_STAGES.has(prop(rec, "lifecyclestage").toLowerCase()) || customerSource(rec, detection) !== null;
}

// engine/agents/shared.ts
var HUBSPOT_BASE3 = process.env.HUBSPOT_API_BASE ?? "https://api.hubapi.com";
function norm(v) {
  return (v == null ? "" : String(v)).trim();
}
function pickLinkedinUrl(raw) {
  const tokens = norm(raw).split(/[,;\s]+/).map((t) => t.trim()).filter(Boolean);
  const hit = tokens.find((t) => /linkedin\.com\/in\//i.test(t));
  if (!hit) return "";
  const withScheme = /^https?:\/\//i.test(hit) ? hit : `https://${hit.replace(/^\/\//, "")}`;
  return withScheme.replace(/\/+$/, "");
}

// engine/company-lookup.ts
var import_tldts = __toESM(require_cjs());
var PATH_HOSTS = /* @__PURE__ */ new Set([
  "sites.google.com",
  "facebook.com",
  "instagram.com",
  "linkedin.com",
  "youtube.com",
  "twitter.com",
  "x.com",
  "tiktok.com",
  "medium.com",
  "welcometothejungle.com",
  "linktr.ee",
  "bit.ly",
  "lnkd.in",
  "t.co",
  "tinyurl.com",
  "goo.gl",
  "ow.ly",
  "buff.ly",
  "cutt.ly",
  "rebrand.ly",
  "shorturl.at",
  "s.id",
  "linkin.bio",
  "beacons.ai",
  "bio.link",
  "tap.bio"
]);
var SUBDOMAIN_HOSTS = [
  "wordpress.com",
  "squarespace.com",
  "wix.com",
  "jimdo.com",
  "jimdofree.com",
  "weebly.com",
  "canva.site",
  "business.site",
  "odoo.com",
  "hubspotpagebuilder.com",
  "webnode.fr",
  "webnode.com",
  "substack.com",
  "strikingly.com",
  "mystrikingly.com",
  "godaddysites.com",
  "systeme.io",
  "teachable.com",
  "e-monsite.com",
  "over-blog.com",
  "wifeo.com",
  "free.fr"
];
var SECTION_LABELS = /* @__PURE__ */ new Set([
  "www2",
  "www3",
  "careers",
  "career",
  "jobs",
  "job",
  "recrutement",
  "recrutements",
  "recrute",
  "emploi",
  "emplois",
  "carriere",
  "carrieres",
  "talent",
  "talents",
  "join",
  "joinus",
  "hiring",
  "blog",
  "shop",
  "store",
  "boutique",
  "corporate",
  "corp",
  "group",
  "groupe",
  "home",
  "web",
  "site",
  "fr",
  "en",
  "de",
  "es",
  "it",
  "nl",
  "pt",
  "uk",
  "us",
  "be",
  "ch",
  "ca",
  "eu",
  "int",
  "global"
]);
function underHost(host2, base) {
  return host2 === base || host2.endsWith(`.${base}`);
}
function websiteHost(v) {
  const s = norm(v).toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "");
  const m = s.match(/^([^/?#]*)(\/[^?#]*)?/);
  const host2 = m?.[1] ?? "";
  const hasPath = (m?.[2] ?? "").replace(/\/+$/, "") !== "";
  if (hasPath && [...PATH_HOSTS].some((h) => underHost(host2, h))) return "";
  return host2;
}
function cleanCompanyDomain(v) {
  let host2 = websiteHost(v);
  if (!host2) return "";
  const path = [...PATH_HOSTS].find((h) => underHost(host2, h));
  if (path) return path;
  const root = (0, import_tldts.getDomain)(host2, { allowPrivateDomains: true });
  if (!root) return "";
  while (host2 !== root) {
    const [label, ...rest] = host2.split(".");
    const next = rest.join(".");
    if (!SECTION_LABELS.has(label) || SUBDOMAIN_HOSTS.includes(next)) break;
    host2 = next;
  }
  return host2;
}
var SHARED_DOMAINS = /* @__PURE__ */ new Set([
  "gmail.com",
  "googlemail.com",
  "outlook.com",
  "hotmail.com",
  "hotmail.fr",
  "yahoo.com",
  "yahoo.fr",
  "orange.fr",
  "wanadoo.fr",
  "free.fr",
  "icloud.com",
  "laposte.net",
  "google.com",
  ...PATH_HOSTS,
  ...SUBDOMAIN_HOSTS
]);

// engine/company-association-rules.ts
var RECENT_CONTACT_DAYS = 90;
function ownEmailDomain(email) {
  const domain = emailDomain(email);
  if (!domain || isPersonalEmailDomain(domain)) return "";
  return cleanCompanyDomain(domain);
}
function createdWithin(createdate, now, days = RECENT_CONTACT_DAYS) {
  const raw = norm(createdate);
  if (!raw) return false;
  const t = /^\d+$/.test(raw) ? Number(raw) : Date.parse(raw);
  if (!Number.isFinite(t)) return false;
  return now - t <= days * 864e5;
}
function triageOrphan(c, now = Date.now()) {
  const linkedinUrl = pickLinkedinUrl(c.hs_linkedin_url);
  if (linkedinUrl) return { route: "linkedin", linkedinUrl };
  const email = norm(c.email);
  const domain = ownEmailDomain(email);
  if (domain && createdWithin(c.createdate, now)) return { route: "domain", domain };
  const firstname = norm(c.firstname);
  const lastname = norm(c.lastname);
  const company = norm(c.company);
  const reverseEligible = email.includes("@") && !isGenericEmail(email);
  if (firstname && lastname && (company || domain)) {
    const hints = [company, domain].filter((h, i, all) => h && all.indexOf(h) === i);
    return { route: "url_search", hints, reverseFallback: reverseEligible, ...domain ? { domain } : {} };
  }
  if (email.includes("@")) {
    if (!reverseEligible) return { route: "none", reason: "generic_email" };
    return { route: "reverse" };
  }
  if (firstname || lastname) return { route: "none", reason: "name_only" };
  return { route: "none", reason: "no_name_no_email" };
}
var WORST_CASE_CREDITS = {
  linkedin: 2,
  // profile read + company page read when the CRM lacks the employer
  domain: 2,
  // company page lookup + its read when the CRM lacks the domain
  // URL lookup 3 + profile read 1 + company page read 1 when found; a URL not
  // found costs nothing and may fall back to the reverse lookup, 8. C and D
  // are never both billed for one contact.
  url_search: 8,
  reverse: 8,
  // reverse email lookup, billed once it found the person
  none: 0
};

// engine/audit/problems.ts
function interleave(a, b, max) {
  const out = [];
  for (let i = 0; out.length < max && (i < a.length || i < b.length); i++) {
    if (i < a.length) out.push(a[i]);
    if (out.length < max && i < b.length) out.push(b[i]);
  }
  return out;
}
function byIds(records, ids) {
  return ids.size === 0 ? [] : records.filter((r) => ids.has(r.id));
}
function findCheck2(pillars, id) {
  for (const p of pillars) {
    const hit = p.checks.find((c) => c.id === id);
    if (hit) return hit;
  }
  return null;
}
function buildProblems(ctx, input) {
  const isChampionContact = championPredicate(ctx);
  const championCompanies = /* @__PURE__ */ new Set();
  if (isChampionContact) {
    for (const rec of ctx.contacts) {
      const company = prop(rec, "associatedcompanyid");
      if (company && isChampionContact(rec)) championCompanies.add(company);
    }
    for (const rec of ctx.companies) {
      if (Number(prop(rec, "total_revenue")) > 0) championCompanies.add(rec.id);
    }
  }
  const contacts = ctx.contacts;
  const companies = ctx.companies;
  const marketing = input.marketingIds;
  const active = ctx.activeOwnerIds;
  const specs = [
    {
      id: "duplicateContacts",
      object: "contact",
      checkId: "duplicates.contacts",
      agent: "duplicate_detector",
      hits: () => ({ affected: byIds(contacts, input.duplicateContactIds), total: contacts.length })
    },
    {
      id: "duplicateCompanies",
      object: "company",
      checkId: "duplicates.companies",
      agent: "duplicate_detector",
      hits: () => ({ affected: byIds(companies, input.duplicateCompanyIds), total: companies.length })
    },
    {
      // Paid for every month, reachable never. No agent: HubSpot refuses the
      // non-marketing switch through the API, the customer does it in HubSpot.
      id: "marketingUnreachable",
      object: "contact",
      checkId: "deliverability.marketingWaste",
      agent: null,
      hits: () => {
        if (!marketing) return null;
        const dead = /* @__PURE__ */ new Set([...input.hardBouncedIds, ...input.optedOutIds, ...input.ghostIds]);
        const affected = contacts.filter((r) => marketing.has(r.id) && dead.has(r.id));
        return { affected, total: marketing.size };
      }
    },
    {
      id: "hardBounces",
      object: "contact",
      checkId: "deliverability.hardBounce",
      agent: "email_verification",
      hits: () => ({
        affected: byIds(contacts, input.hardBouncedIds),
        total: contacts.filter((r) => filled(r, "email")).length
      })
    },
    {
      id: "likelyMoved",
      object: "contact",
      checkId: "staleness.contact.atRisk",
      agent: "job_change_tracker",
      hits: () => ({ affected: byIds(contacts, input.atRiskIds), total: contacts.length })
    },
    {
      id: "missingEmail",
      object: "contact",
      checkId: "completeness.contact.email",
      agent: "crm_enrichment",
      hits: () => ({ affected: contacts.filter((r) => !filled(r, "email")), total: contacts.length })
    },
    {
      id: "noCompany",
      object: "contact",
      checkId: "structure.contact.noCompany",
      agent: "company_association",
      hits: () => ({
        affected: contacts.filter((r) => !filled(r, "associatedcompanyid")),
        total: contacts.length
      }),
      activableIfFixed: input.activation?.oneAway.company ?? null,
      // The agent's own triage, way by way: what a pass can cost at most.
      creditsCeiling: (affected) => affected.reduce((sum, r) => sum + WORST_CASE_CREDITS[triageOrphan(r.properties ?? {}, ctx.now).route], 0)
    },
    {
      id: "missingJobTitle",
      object: "contact",
      checkId: "completeness.contact.jobtitle",
      agent: "crm_enrichment",
      hits: () => ({ affected: contacts.filter((r) => !filled(r, "jobtitle")), total: contacts.length }),
      activableIfFixed: input.activation?.oneAway.jobTitle ?? null
    },
    {
      // No owner, or an owner who left the team: the activable criterion
      // exactly, so `activableIfFixed` is exact too. Evidence comes from the
      // "no owner" check, the larger half on most portals.
      id: "noActiveOwner",
      object: "contact",
      checkId: "structure.contact.noOwner",
      agent: null,
      hits: () => {
        if (!ctx.contactProps.has("hubspot_owner_id")) return null;
        const affected = contacts.filter((r) => {
          const owner = prop(r, "hubspot_owner_id");
          return !owner || active !== null && !active.has(owner);
        });
        return { affected, total: contacts.length };
      },
      activableIfFixed: input.activation?.oneAway.owner ?? null,
      // Both halves: no owner, and an owner who left (with the owner's id).
      evidence: (affected) => {
        const none = affected.filter((r) => !prop(r, "hubspot_owner_id"));
        const gone = affected.filter((r) => prop(r, "hubspot_owner_id"));
        return interleave(
          none.map((rec) => ({ rec })),
          gone.map((rec) => ({ rec, detail: { ownerId: prop(rec, "hubspot_owner_id") } })),
          MAX_FINDINGS_PER_CHECK
        );
      }
    },
    {
      // Only contacts already reachable by email, company, title and owner: a
      // phone on a contact nobody can work is not worth a mobile search, and
      // the price on the card is then the useful one. Whole base as a fallback
      // when activability cannot be judged.
      id: "missingPhone",
      object: "contact",
      checkId: "completeness.contact.phone",
      agent: "crm_enrichment",
      hits: () => {
        const noPhone = (r) => !filled(r, "phone") && !filled(r, "mobilephone");
        const activable = input.activableIds;
        if (!activable) return { affected: contacts.filter(noPhone), total: contacts.length };
        return {
          affected: contacts.filter((r) => activable.has(r.id) && noPhone(r)),
          total: activable.size,
          base: "activable"
        };
      },
      // The affected records themselves: activable contacts with no phone.
      evidence: (affected) => affected.slice(0, MAX_FINDINGS_PER_CHECK).map((rec) => ({ rec }))
    },
    {
      // Domain, industry or headcount missing: the three a team segments on.
      id: "incompleteCompanies",
      object: "company",
      checkId: "completeness.company.domain",
      agent: "crm_enrichment",
      hits: () => ({
        affected: companies.filter(
          (r) => !filled(r, "domain") && !filled(r, "website") || !filled(r, "industry") || !filled(r, "numberofemployees")
        ),
        total: companies.length
      }),
      // Whatever is missing, said per company.
      evidence: (affected) => affected.slice(0, MAX_FINDINGS_PER_CHECK).map((rec) => ({
        rec,
        // `missing`: field keys the page translates (audit-problems.tsx).
        detail: {
          missing: [
            ...!filled(rec, "domain") && !filled(rec, "website") ? ["domain"] : [],
            ...!filled(rec, "industry") ? ["industry"] : [],
            ...!filled(rec, "numberofemployees") ? ["headcount"] : []
          ]
        }
      }))
    },
    // --- Version 14 (lot 5b), outside the score ---------------------------
    {
      // Came in on their own (form, chat, ad) between 7 and 90 days ago, and
      // nobody active owns them or nothing was ever logged. No agent: a person
      // assigns them and plans the call.
      id: "untreatedLeads",
      object: "contact",
      checkId: "freshness.contact.untreatedLeads",
      agent: null,
      hits: () => {
        const recent = contacts.filter((r) => isRecentInbound(r, ctx));
        return { affected: recent.filter((r) => untreatedReasons(r, ctx).length > 0), total: recent.length };
      }
    },
    {
      // A customer account known through one person or none: if that person
      // leaves, the account goes dark. Find People of the enrichment agent will
      // fix it best once out; new hire detection keeps it covered meanwhile.
      id: "singleContactCustomers",
      object: "company",
      checkId: "structure.company.singleContactCustomers",
      agent: "new_hire_tracker",
      hits: () => {
        if (!canCountAccountContacts(ctx)) return null;
        const customers = companies.filter(isCustomerCompany);
        return { affected: customers.filter(isThinCustomerAccount), total: customers.length };
      }
    },
    {
      // Contacts only: the company check is in the annex. Contacts are where
      // the free text grows (LinkedIn locations pasted as countries).
      id: "unnormalizedCountries",
      object: "contact",
      checkId: "quality.contact.country",
      agent: null,
      hits: () => {
        if (!ctx.contactProps.has("country")) return null;
        const { total, fixes } = judgeCountries(contacts);
        return { affected: contacts.filter((r) => fixes.has(r.id)), total };
      }
    }
  ];
  const problems = [];
  for (const spec of specs) {
    const check = findCheck2(input.pillars, spec.checkId);
    if (!check || check.score === null || check.skipped) continue;
    const hits = spec.hits();
    if (!hits || hits.affected.length === 0) continue;
    const affected = hits.affected.length;
    const ratio = hits.total > 0 ? affected / hits.total : 0;
    const severity = severityFromNormalized(Math.min(1, ratio / (CRITICAL_RATIO[spec.checkId] ?? 1)));
    const champions = isChampionContact ? hits.affected.filter(
      (r) => spec.object === "contact" ? isChampionContact(r) : championCompanies.has(r.id)
    ).length : null;
    const weighted = affected - (champions ?? 0) + (champions ?? 0) * CHAMPION_RANK_WEIGHT;
    let evidenceCheckId;
    if (spec.evidence && input.evidence) {
      evidenceCheckId = `problem.${spec.id}`;
      for (const { rec, detail } of spec.evidence(hits.affected))
        input.evidence.add(evidenceCheckId, spec.object, rec, detail);
    }
    const price = input.waste?.eurosPerContactPerMonth;
    const sourced = canSeeSource(spec.object === "contact" ? ctx.contactProps : ctx.companyProps);
    problems.push({
      id: spec.id,
      object: spec.object,
      checkId: spec.checkId,
      ...evidenceCheckId ? { evidenceCheckId } : {},
      affected,
      total: hits.total,
      ...hits.base ? { base: hits.base } : {},
      champions,
      severity,
      rank: Math.round(
        weighted * SEVERITY_RANK_WEIGHT[severity] * (PROBLEM_RANK_WEIGHT[spec.id] ?? 1)
      ),
      agent: spec.agent,
      ...spec.activableIfFixed != null ? { activableIfFixed: spec.activableIfFixed } : {},
      ...spec.creditsCeiling ? { creditsCeiling: spec.creditsCeiling(hits.affected) } : {},
      // The billed cost of the marketing problem, at the waste estimate's price.
      ...spec.id === "marketingUnreachable" && price != null ? { eurosPerYear: Number((affected * price * 12).toFixed(2)) } : {},
      ...sourced ? { bySource: countBySource(hits.affected) } : {}
    });
  }
  problems.sort((a, b) => b.rank - a.rank || b.affected - a.affected);
  return pinCritical(problems);
}
function pinCritical(problems) {
  for (const id of ALWAYS_SHOWN_WHEN_CRITICAL) {
    const serious = problems.filter((p) => p.severity !== "ok");
    const at = serious.findIndex((p) => p.id === id);
    if (at < PROBLEM_CARDS || serious[at].severity !== "critical") continue;
    const pinned = serious[at];
    problems.splice(problems.indexOf(pinned), 1);
    problems.splice(problems.indexOf(serious[PROBLEM_CARDS - 1]), 0, pinned);
  }
  return problems;
}

// engine/audit/opportunity.ts
function isWon(rec, ctx) {
  if (ctx.dealProps.has("hs_is_closed_won")) return bool(rec, "hs_is_closed_won");
  const stage = prop(rec, "dealstage").toLowerCase();
  return stage.includes("won");
}
function typicalWonDeal(ctx) {
  if (!ctx.capabilities.has("deals") || !ctx.dealProps.has("amount")) return null;
  const amounts = [];
  for (const deal of ctx.deals) {
    if (!isWon(deal, ctx)) continue;
    const amount = num(deal, "amount");
    if (amount <= 0) continue;
    amounts.push(amount);
  }
  if (amounts.length < MIN_WON_DEALS_FOR_AVERAGE) return null;
  amounts.sort((a, b) => a - b);
  const mid = Math.floor(amounts.length / 2);
  const median = amounts.length % 2 === 0 ? (amounts[mid - 1] + amounts[mid]) / 2 : amounts[mid];
  return { value: median, count: amounts.length };
}
function typicalCompanyRevenue(ctx) {
  if (!ctx.companyProps.has("total_revenue")) return null;
  const amounts = [];
  for (const company of ctx.companies) {
    const revenue = num(company, "total_revenue");
    if (revenue > 0) amounts.push(revenue);
  }
  if (amounts.length < MIN_WON_DEALS_FOR_AVERAGE) return null;
  amounts.sort((a, b) => a - b);
  const mid = Math.floor(amounts.length / 2);
  const median = amounts.length % 2 === 0 ? (amounts[mid - 1] + amounts[mid]) / 2 : amounts[mid];
  return { value: median, count: amounts.length };
}
function estimateOpportunity(ctx, opts = {}) {
  const hasDates = ctx.contactProps.has("lastmodifieddate") || ctx.contactProps.has("createdate");
  if (!hasDates || ctx.contacts.length === 0) return null;
  const detection = detectCustomers(ctx);
  const detectable = canDetectCustomers(detection);
  let customers = 0;
  const customersBy = { lifecycle: 0, revenue: 0, both: 0 };
  let atRiskCustomers = 0;
  let customerDeparted = 0;
  let baseTracked = 0;
  let baseDeparted = 0;
  const reference = employmentReferenceKind(ctx);
  for (const rec of ctx.contacts) {
    const since = employmentReference(rec, ctx, reference);
    if (since === null) continue;
    const months = monthsSince(since, ctx.now);
    const probability = obsolescenceProbability(months);
    baseTracked++;
    baseDeparted += probability;
    const source = detectable ? customerSource(rec, detection) : null;
    if (source !== null) {
      customers++;
      customersBy[source]++;
      customerDeparted += probability;
      if (months >= STALE_MONTHS) atRiskCustomers++;
    }
  }
  if (baseTracked === 0) return null;
  const departureRate = customers > 0 ? customerDeparted / customers : baseDeparted / baseTracked;
  const wonDeal = typicalWonDeal(ctx);
  const companyRevenue = wonDeal ? null : typicalCompanyRevenue(ctx);
  const measured = wonDeal ?? companyRevenue;
  const averageDealEuros = opts.averageDealEuros ?? measured?.value ?? DEFAULT_AVERAGE_DEAL_EUROS;
  const winRate = opts.winRate ?? CHAMPION_WIN_RATE;
  const departedCustomers = Math.round(customers * departureRate);
  return {
    customers,
    customersSource: customers > 0 ? "crm" : "manual",
    customersBy,
    atRiskCustomers,
    departedCustomers,
    departureRate: Number(departureRate.toFixed(4)),
    averageDealEuros: Number(averageDealEuros.toFixed(2)),
    averageDealSource: opts.averageDealEuros != null || !measured ? "default" : wonDeal ? "crm" : "companies",
    wonDealsSampled: opts.averageDealEuros == null ? measured?.count ?? 0 : 0,
    assumedWinRate: winRate,
    opportunityEuros: Number((departedCustomers * winRate * averageDealEuros).toFixed(2))
  };
}

// engine/audit/remediation.ts
var CONTACT_PROFILE_PROPS = ["hs_linkedin_url", "jobtitle"];
var CONTACT_EMAIL_PROPS = ["email"];
var CONTACT_PHONE_PROPS = ["phone", "mobilephone"];
var COMPANY_PROPS = [
  "domain",
  "website",
  "industry",
  "numberofemployees",
  "city",
  "country",
  "linkedin_company_page",
  "hs_linkedin_handle"
];
function recordsMissingAny(records, props, available) {
  const usable = props.filter((p) => available.has(p));
  if (usable.length === 0) return null;
  return records.filter((rec) => usable.some((p) => !filled(rec, p))).length;
}
function recordsMissingAll(records, props, available) {
  const usable = props.filter((p) => available.has(p));
  if (usable.length === 0) return null;
  return records.filter((rec) => usable.every((p) => !filled(rec, p))).length;
}
var SCAN_IDENTITY_PROPS = ["hs_linkedin_url", "company", "associatedcompanyid"];
function monthlyIntake(records, available, now, capped) {
  if (capped || !available.has("createdate")) return null;
  const perMonth = /* @__PURE__ */ new Map();
  let oldest = 0;
  for (const rec of records) {
    const created = dateProp(rec, "createdate");
    if (created === null) continue;
    const age = Math.floor(monthsSince(created, now));
    if (age > oldest) oldest = age;
    if (age < 1 || age > INTAKE_WINDOW_MONTHS) continue;
    perMonth.set(age, (perMonth.get(age) ?? 0) + 1);
  }
  const observed = Math.min(oldest, INTAKE_WINDOW_MONTHS);
  if (observed < MIN_INTAKE_MONTHS) return null;
  const counts = [];
  for (let m = 1; m <= observed; m++) counts.push(perMonth.get(m) ?? 0);
  counts.sort((a, b) => a - b);
  const mid = Math.floor(counts.length / 2);
  const median = counts.length % 2 === 0 ? (counts[mid - 1] + counts[mid]) / 2 : counts[mid];
  return Math.round(median);
}
function countChampions(ctx) {
  const isChampion = championPredicate(ctx);
  return isChampion ? ctx.contacts.filter(isChampion).length : null;
}
function countScannable(ctx) {
  const usable = SCAN_IDENTITY_PROPS.filter((p) => ctx.contactProps.has(p));
  if (usable.length === 0) return null;
  return ctx.contacts.filter((rec) => {
    const named = filled(rec, "lastname");
    return named && usable.some((p) => filled(rec, p));
  }).length;
}
function buildRemediation(ctx, duplicates) {
  const contactsMissingEmail = recordsMissingAll(
    ctx.contacts,
    CONTACT_EMAIL_PROPS,
    ctx.contactProps
  );
  const contactsMissingPhone = recordsMissingAll(
    ctx.contacts,
    CONTACT_PHONE_PROPS,
    ctx.contactProps
  );
  const contactsNeedingProfile = recordsMissingAny(
    ctx.contacts,
    CONTACT_PROFILE_PROPS,
    ctx.contactProps
  );
  const companiesNeedingEnrichment = recordsMissingAny(
    ctx.companies,
    COMPANY_PROPS,
    ctx.companyProps
  );
  const contactsWithEmail = ctx.contactProps.has("email") ? ctx.contacts.filter((rec) => filled(rec, "email")).length : null;
  return {
    duplicateContacts: duplicates.affectedContactIds.size,
    duplicateCompanies: duplicates.affectedCompanies,
    contactsMissingEmail,
    contactsMissingPhone,
    contactsNeedingProfile,
    companiesNeedingEnrichment,
    contactsWithEmail,
    // The whole base, kept as the outer bound of what could be watched. It is
    // no longer what the quote bills: nobody scans four hundred thousand
    // contacts every month, so the quote watches the champions monthly and
    // sweeps the rest by rotation, using the two counts below.
    contactsTrackable: ctx.contacts.length,
    contactsScanned: ctx.contacts.length,
    companiesScanned: ctx.companies.length,
    championContacts: countChampions(ctx),
    contactsScannable: countScannable(ctx),
    monthlyNewContacts: monthlyIntake(
      ctx.contacts,
      ctx.contactProps,
      ctx.now,
      ctx.scan.contactsCapped
    ),
    monthlyNewCompanies: monthlyIntake(
      ctx.companies,
      ctx.companyProps,
      ctx.now,
      ctx.scan.companiesCapped
    )
  };
}

// engine/audit/score.ts
function scoreChecks(checks) {
  let weighted = 0;
  let totalWeight = 0;
  for (const check of checks) {
    if (check.score === null) continue;
    weighted += check.score * check.weight;
    totalWeight += check.weight;
  }
  if (totalWeight === 0) return null;
  return Math.round(weighted / totalWeight);
}
function severityForScore2(score) {
  if (score === null) return "ok";
  if (score <= 100 - SEVERITY_CRITICAL_RATIO * 100) return "critical";
  if (score <= 100 - SEVERITY_WARNING_RATIO * 100) return "warning";
  return "ok";
}
function buildPillar(id, checks, opts) {
  const score = scoreChecks(checks);
  const inferredSkip = score === null ? checks.find((c) => c.skipped === "missing_scope")?.skipped ?? checks.find((c) => c.skipped)?.skipped ?? "no_data" : void 0;
  return {
    id,
    score,
    weight: PILLAR_WEIGHTS[id],
    severity: severityForScore2(score),
    checks,
    ...opts?.skipped ?? inferredSkip ? { skipped: opts?.skipped ?? inferredSkip } : {},
    ...opts?.requiredScope ? { requiredScope: opts.requiredScope } : {}
  };
}
function scorePillars(pillars) {
  let weighted = 0;
  let totalWeight = 0;
  for (const pillar of pillars) {
    if (pillar.score === null) continue;
    weighted += pillar.score * pillar.weight;
    totalWeight += pillar.weight;
  }
  if (totalWeight === 0) return 0;
  return Math.round(weighted / totalWeight);
}
function scoreWithCap(pillars) {
  const mean = scorePillars(pillars);
  const checks = [];
  for (const pillar of pillars) {
    for (const check of pillar.checks) {
      if (check.score === null || check.severity !== "critical") continue;
      if (SCORE_CAP_CHECKS.has(check.id)) checks.push(check.id);
    }
  }
  if (checks.length === 0 || mean <= SCORE_CAP_MAX) return { score: mean, cap: null };
  return { score: SCORE_CAP_MAX, cap: { max: SCORE_CAP_MAX, uncappedScore: mean, checks } };
}

// engine/audit/waste.ts
function estimateWaste(input) {
  const { totalContacts } = input;
  if (totalContacts <= 0) return null;
  const price = input.eurosPerContactPerMonth ?? DEFAULT_EUROS_PER_CONTACT_PER_MONTH;
  const marketing = input.marketingContactIds ?? null;
  if (marketing === null) {
    const exact2 = new Set(input.duplicateContactIds);
    for (const id of input.hardBouncedIds) exact2.add(id);
    const stale2 = staleShare(input, totalContacts - exact2.size);
    const unusableContacts2 = Math.min(totalContacts, exact2.size + stale2);
    return {
      basis: "allContacts",
      marketingContacts: null,
      unusableContacts: unusableContacts2,
      duplicateContacts: input.duplicateContactIds.size,
      hardBouncedContacts: input.hardBouncedIds.size,
      likelyStaleContacts: stale2,
      eurosPerContactPerMonth: price,
      eurosPerYear: Number((unusableContacts2 * price * 12).toFixed(2))
    };
  }
  const within = (ids) => {
    const kept = /* @__PURE__ */ new Set();
    for (const id of ids ?? []) if (marketing.has(id)) kept.add(id);
    return kept;
  };
  const duplicates = within(input.duplicateContactIds);
  const hardBounced = within(input.hardBouncedIds);
  const optedOut = within(input.optedOutIds);
  const ghosts = within(input.ghostIds);
  const exact = /* @__PURE__ */ new Set([...duplicates, ...hardBounced, ...optedOut, ...ghosts]);
  const stale = staleShare(input, marketing.size - exact.size);
  const unusableContacts = Math.min(marketing.size, exact.size + stale);
  return {
    basis: "marketing",
    marketingContacts: marketing.size,
    unusableContacts,
    duplicateContacts: duplicates.size,
    hardBouncedContacts: hardBounced.size,
    optedOutContacts: optedOut.size,
    ghostContacts: ghosts.size,
    likelyStaleContacts: stale,
    eurosPerContactPerMonth: price,
    eurosPerYear: Number((unusableContacts * price * 12).toFixed(2))
  };
}
function staleShare(input, remaining) {
  const total = input.totalContacts;
  if (total <= 0 || remaining <= 0) return 0;
  const rate = Math.min(1, Math.max(0, input.likelyStaleContacts) / total);
  return Math.round(remaining * rate);
}

// engine/audit/run.ts
function countOwningOwners(ctx) {
  const active = ctx.activeOwnerIds;
  if (!active) return null;
  const owning = /* @__PURE__ */ new Set();
  for (const records of [ctx.contacts, ctx.companies]) {
    for (const rec of records) {
      const owner = (rec.properties?.hubspot_owner_id ?? "").toString().trim();
      if (owner && active.has(owner)) owning.add(owner);
    }
  }
  return owning.size;
}
function analyse(ctx, opts = {}) {
  const ev = new EvidenceCollector();
  const duplicates = runDuplicates(ctx, ev);
  const completeness = runCompleteness(ctx, ev);
  const quality = runQuality(ctx, ev);
  const structure = runStructure(ctx, ev);
  const freshness = runFreshness(ctx, ev);
  const staleness = runStaleness(ctx, ev);
  const deliverability = runDeliverability(ctx, ev);
  const pipeline = runPipeline(ctx, ev);
  const schemaDebt = runSchemaDebt(ctx, ev);
  const unscored = runUnscored(ctx, ev);
  const pillars = [
    buildPillar("duplicates", duplicates.checks),
    buildPillar("completeness", completeness.checks),
    buildPillar("quality", [...quality.checks, ...unscored.quality]),
    buildPillar("structure", [...structure.checks, ...unscored.structure], {
      skipped: structure.skipped,
      requiredScope: structure.requiredScope
    }),
    buildPillar("freshness", [...freshness.checks, ...unscored.freshness]),
    buildPillar("staleness", staleness.checks),
    buildPillar("deliverability", deliverability.checks),
    buildPillar("pipeline", pipeline.checks, {
      skipped: pipeline.skipped,
      requiredScope: pipeline.requiredScope
    }),
    buildPillar("schemaDebt", schemaDebt.checks, {
      skipped: schemaDebt.skipped,
      requiredScope: schemaDebt.requiredScope
    })
  ];
  const waste = estimateWaste({
    totalContacts: ctx.contacts.length,
    marketingContactIds: deliverability.totals.marketingIds,
    duplicateContactIds: duplicates.totals.affectedContactIds,
    hardBouncedIds: deliverability.totals.hardBouncedIds,
    optedOutIds: deliverability.totals.optedOutIds,
    ghostIds: deliverability.totals.ghostIds,
    likelyStaleContacts: staleness.totals.likelyObsolete,
    eurosPerContactPerMonth: opts.eurosPerContactPerMonth
  });
  const { score, cap } = scoreWithCap(pillars);
  const activation = buildActivation(ctx, deliverability.totals);
  const activableIds = activableContactIds(ctx, deliverability.totals);
  const problems = buildProblems(ctx, {
    pillars,
    activation,
    activableIds,
    waste,
    duplicateContactIds: duplicates.totals.affectedContactIds,
    duplicateCompanyIds: duplicates.totals.affectedCompanyIds,
    hardBouncedIds: deliverability.totals.hardBouncedIds,
    optedOutIds: deliverability.totals.optedOutIds,
    ghostIds: deliverability.totals.ghostIds,
    marketingIds: deliverability.totals.marketingIds,
    atRiskIds: staleness.totals.atRiskIds,
    evidence: ev
  });
  const report = {
    version: AUDIT_REPORT_VERSION,
    generatedAt: new Date(ctx.now).toISOString(),
    portalId: ctx.portalId,
    scanned: ctx.scan,
    pillars,
    score,
    scoreCap: cap,
    activation,
    problems,
    // Where the records come from, and whether this month's intake is better
    // than the base it lands in (sources.ts).
    sources: buildSources(ctx),
    newContacts: buildNewContacts(ctx, activableIds),
    // Descriptive, unscored: the shape of the base next to its defects.
    distributions: buildDistributions(ctx),
    // Counted per record and per billable action, so the signup can quote the
    // work without inflating it — see remediation.ts.
    remediation: buildRemediation(ctx, duplicates.totals),
    waste,
    // Stored with the defaults; the report UI lets the reader substitute their
    // own deal value and close rate and recomputes without rescanning.
    opportunity: estimateOpportunity(ctx),
    // Decides whether the signup offers French legal data (onboarding.ts).
    markets: buildMarkets(ctx),
    // The onboarding offer counts the time saved per person working in the CRM.
    activeOwners: ctx.activeOwnerIds ? ctx.activeOwnerIds.size : null,
    // The calculator's sales headcount: seats that actually own records.
    owningOwners: countOwningOwners(ctx),
    capabilities: [...ctx.capabilities].sort()
  };
  return {
    report,
    findings: [...ev.findings, ...duplicates.findings, ...completeness.findings]
  };
}

// src/cli.ts
var FINDINGS_PER_CHECK = 25;
var USAGE = `CRM Health Check: read-only audit of a HubSpot portal.

Usage:
  HUBSPOT_TOKEN=pat-xx-... node crm-audit.mjs [options]
  node crm-audit.mjs --token pat-xx-... [options]

Options:
  --token <token>   HubSpot private app access token (or set HUBSPOT_TOKEN).
                    Prefer the environment variable: it keeps the token out of
                    your shell history.
  --out <path>      Where to write the JSON report (default: crm-audit-report.json)
  --lang <en|fr>    Language of the HTML report (default: en)
  --price <euros>   Monthly price per marketing contact used in the waste
                    estimate (default: 0.02)
  --render <json>   Re-render the HTML report from an existing JSON report,
                    without rescanning (no token needed).
  --no-open         Do not open the HTML report in the browser when done.
  --help            Show this help.

Outputs both a JSON report (the data) and an HTML dashboard next to it
(same path, .html extension): open it in any browser, it works offline.

The token needs read-only scopes. Required:
  crm.objects.contacts.read, crm.objects.companies.read
Recommended (each one unlocks extra pillars; absent ones are reported as
"not analysed", never as a perfect score):
  crm.objects.deals.read, crm.objects.owners.read,
  crm.schemas.contacts.read, crm.schemas.companies.read, crm.schemas.deals.read

This tool never writes to your CRM and never contacts any server other than
api.hubapi.com. You can delete the private app in HubSpot right after the
audit; the report file is yours.`;
function parseArgs(argv) {
  const args = {
    token: process.env.HUBSPOT_TOKEN ?? null,
    out: "crm-audit-report.json",
    price: void 0,
    lang: "en",
    render: null,
    open: true
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--help" || a === "-h") return "help";
    else if (a === "--token") args.token = argv[++i] ?? null;
    else if (a === "--out") args.out = argv[++i] ?? args.out;
    else if (a === "--render") args.render = argv[++i] ?? null;
    else if (a === "--no-open") args.open = false;
    else if (a === "--lang") {
      const l = argv[++i];
      if (l !== "en" && l !== "fr") fail(`--lang must be "en" or "fr", got: ${l}`);
      args.lang = l;
    } else if (a === "--price") {
      const p = Number(argv[++i]);
      if (!Number.isFinite(p) || p <= 0) fail("--price must be a positive number (euros per contact per month).");
      args.price = p;
    } else fail(`Unknown option: ${a}

Run with --help for usage.`);
  }
  return args;
}
function fail(message) {
  console.error(`
Error: ${message}`);
  process.exit(1);
}
async function preflight(token) {
  const res = await fetch(`${HUBSPOT_BASE2}/crm/v3/objects/contacts?limit=1&archived=false`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (res.status === 401) {
    fail(
      'HubSpot rejected the token (401). Check that you copied the full private app token (it starts with "pat-") and that the app was not deleted.'
    );
  }
  if (res.status === 403) {
    fail(
      "The token is valid but lacks the mandatory scope crm.objects.contacts.read (403). Edit the private app in HubSpot (Settings \u2192 Integrations \u2192 Private Apps \u2192 your app \u2192 Scopes), add it, and run again."
    );
  }
  if (!res.ok) {
    fail(`Unexpected HubSpot response during preflight: HTTP ${res.status}. Try again in a minute.`);
  }
}
var STEP_LABELS = {
  connection: "Checking token and granted scopes",
  properties: "Reading property catalogs",
  contacts: "Scanning contacts",
  companies: "Scanning companies",
  deals: "Scanning deals",
  owners: "Reading owners",
  schema: "Sampling custom properties",
  analysis: "Computing the report"
};
function htmlPathFor(jsonPath) {
  return jsonPath.replace(/\.json$/i, "").concat(".html");
}
function openInBrowser(path) {
  const [cmd, args] = process.platform === "darwin" ? ["open", [path]] : process.platform === "win32" ? ["cmd", ["/c", "start", "", path]] : ["xdg-open", [path]];
  try {
    spawn(cmd, args, { stdio: "ignore", detached: true }).on("error", () => {
    }).unref();
  } catch {
  }
}
async function main() {
  const parsed = parseArgs(process.argv.slice(2));
  if (parsed === "help") {
    console.log(USAGE);
    return;
  }
  if (parsed.render) {
    const jsonPath = resolve(parsed.render);
    const data = JSON.parse(readFileSync(jsonPath, "utf8"));
    const htmlPath2 = htmlPathFor(jsonPath);
    writeFileSync(htmlPath2, renderReportHtml(data.report, data.evidence ?? [], parsed.lang));
    if (parsed.open) openInBrowser(htmlPath2);
    console.log(`Report: ${pathToFileURL(htmlPath2).href}`);
    return;
  }
  if (!parsed.token) {
    fail(
      "No token provided. Set the HUBSPOT_TOKEN environment variable or pass --token.\n\nRun with --help for how to create a read-only private app token."
    );
  }
  console.error("CRM Health Check: read-only audit, nothing is written to your CRM.\n");
  await preflight(parsed.token);
  let lastLine = "";
  const onProgress = (pct, step) => {
    const line = `[${String(pct).padStart(3)}%] ${STEP_LABELS[step] ?? step}`;
    if (line === lastLine) return;
    lastLine = line;
    console.error(line);
  };
  const now = Date.now();
  const { context } = await collectAuditContext(parsed.token, now, onProgress);
  const { report, findings } = analyse(context, {
    eurosPerContactPerMonth: parsed.price
  });
  const byCheck = /* @__PURE__ */ new Map();
  for (const f of findings) {
    const bucket = byCheck.get(f.checkId) ?? [];
    if (bucket.length < FINDINGS_PER_CHECK) bucket.push(f);
    byCheck.set(f.checkId, bucket);
  }
  const evidence = [...byCheck.values()].flat().map((f) => ({
    ...f,
    hubspotUrl: hubspotUrl(report.portalId, f.objectType, f.objectId)
  }));
  const outPath = resolve(parsed.out);
  writeFileSync(
    outPath,
    JSON.stringify({ report, evidence, evidencePerCheckCap: FINDINGS_PER_CHECK }, null, 2)
  );
  const htmlPath = htmlPathFor(outPath);
  writeFileSync(htmlPath, renderReportHtml(report, evidence, parsed.lang));
  const capped = report.scanned.contactsCapped || report.scanned.companiesCapped || report.scanned.dealsCapped;
  const analysed = report.pillars.filter((p) => p.score !== null);
  const skipped = report.pillars.filter((p) => p.score === null);
  console.error(`[100%] Done.
`);
  console.log(`Audit complete. Health score: ${report.score}/100`);
  const a = report.activation;
  if (a) {
    console.log(
      `   Activable contacts: ${a.activable.toLocaleString("en-US")} of ${a.contacts.toLocaleString("en-US")} (valid email, a company, a job title and an active owner)`
    );
  }
  console.log(
    `   Scanned: ${report.scanned.contacts.toLocaleString("en-US")} contacts, ${report.scanned.companies.toLocaleString("en-US")} companies, ${report.scanned.deals.toLocaleString("en-US")} deals` + (capped ? " (scan cap reached: the portal holds more)" : "")
  );
  const top = topProblems(report);
  if (top.length) console.log(`   Fix first:`);
  for (const [i, p] of top.entries()) {
    console.log(
      `   ${i + 1}. ${p.id}: ${p.affected.toLocaleString("en-US")} of ${p.total.toLocaleString("en-US")} ${p.object === "company" ? "companies" : "contacts"} (${p.severity})`
    );
  }
  for (const p of analysed) {
    console.log(`   \u2022 ${p.id}: ${p.score}/100 (${p.severity})`);
  }
  for (const p of skipped) {
    const why = p.skipped === "missing_scope" ? `grant ${p.requiredScope ?? "the missing scope"} to unlock` : "no usable data on this portal";
    console.log(`   \u2022 ${p.id}: not analysed, ${why}`);
  }
  if (report.waste) {
    console.log(
      `   Estimated waste: \u20AC${Math.round(report.waste.eurosPerYear).toLocaleString("en-US")}/year (${report.waste.unusableContacts.toLocaleString("en-US")} unusable contacts at \u20AC${report.waste.eurosPerContactPerMonth}/contact/month)`
    );
  }
  if (report.opportunity && report.opportunity.opportunityEuros > 0) {
    console.log(
      `   Untapped opportunity: ~\u20AC${Math.round(report.opportunity.opportunityEuros).toLocaleString("en-US")} (customers who likely changed company)`
    );
  }
  if (parsed.open) openInBrowser(htmlPath);
  console.log(`
Data:      ${outPath}`);
  console.log(`Dashboard: ${pathToFileURL(htmlPath).href}`);
  console.log(
    parsed.open ? `   The dashboard was opened in the default browser. If it did not appear, open the URL above.` : `   Open the URL above in a browser to view the dashboard.`
  );
}
main().catch((e) => {
  const msg = e.message ?? String(e);
  if (msg.includes("\u2192 401")) {
    fail("HubSpot rejected the token mid-scan (401). The token may have been revoked; create a new one and run again.");
  }
  if (msg.includes("\u2192 403")) {
    fail(`A scope is missing for part of the scan (403): ${msg}. Add the read scopes listed in --help and run again.`);
  }
  fail(msg);
});
