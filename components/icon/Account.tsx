import * as React from "react";
import Svg, { Rect, Defs, Pattern, Use, Image } from "react-native-svg";

const Account = (props: any) => (
  <Svg
    width={21}
    height={20}
    viewBox="0 0 21 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Rect x={0.5} width={20} height={20} fill="url(#pattern0_686_2161)" />
    <Defs>
      <Pattern
        id="pattern0_686_2161"
        patternContentUnits="objectBoundingBox"
        width={1}
        height={1}
      >
        <Use
          xlinkHref="#image0_686_2161"
          transform="scale(0.0104167)"
        />
      </Pattern>
      <Image
        id="image0_686_2161"
        width={96}
        height={96}
        preserveAspectRatio="none"
        href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAACXBIWXMAAAsTAAALEwEAmpwYAAAFPElEQVR4nO2d7YtWRRTAf+5upWThRoFugZWrK718kUwTwuxbQVQs2htF9R/0ttaaJRi9UERtCCl9WUgpy7LtW1YQfTHbohbpvVyzD+5mSrWxutEzMnguyNLMvc8+z7137jPnBwfc6713zjlz79yZM2fmAUVRFEVRFEVRlDBpA1YC/cAuYD9wFJgSOSrH3gYeA1bINUqDXAg8DRwCTJ3yq1zbVbYRVeQ8YAtwfAaOny72Hq8AnWUbVRXWAeNNcPx0GQN6yzYuZDrkqTc5ywDQXraxoTEHGCrA+Ym8C8wu2+iQnvyhDE6rAfuADcBqoAc4W6RHjm2Qc2oZK0HfBNKbnf+A7cCiOu7ZDezIUBEvEznrUhz0PbCsgftfBfyQUkZvzF3NcY9jPmhS19HeY09K7yjKLuqWFOfbb0Oz6EipBNsziooFwKSn2cnjiez0NEfHYxsxP+P54C7Lsdzlng/zU0RCm8RpzP/I6wWU/4aj7IOxBPBWevr5iwoof7HnLbBvSMvT7zD+swJ1GHbosJ4IeMdhfH+BOmx06PAWEbDfYfzqAnVY49BhhAj4w2F8d4E6LHHo8DsRcMJh/NwCdZjrGQ+0PCFUwLkxV4CrCVpcoA5LY26C9CNcMrscxj9eoA5POnTYScQDsc8L1OFLhw59RMAKTyiiu+RQhJ3AiToYt6OA8nc6yh6NJRiHZKwZx1uQ51N4tefp30xE+CZkfgHOz2kK9EdHmZOxTcgg6YLGIXuaPCV5BvChp7yXiJBOmRB3OeUT4IImPfm++eDDwDwipdfjGCNzuMsbbPNdzU7yzbmFyBlIqYSaTCPWE6qw576ZITHrxRztqgztwO4URyUVMSyTKWsknpOkJi6VYxvlnCypiXZErqmJwmzJ1TQFiXX+WUnhyinaJVczT8fXpNnRJz/lwzyWg/Ntb+fWso2rUhd1wDNYq0cmpZ8fbVezEbokY+3gDBw/KuEFO+pWGqRNxgPrJXVkRGbWTojYf38t/9cn8aRoAmuKoiiKoiiKoihIaHgb8C0wUWCU0zRZJsSGrcB1VAC7xOijABxnchI7tXkJgbIKOBKAk0zOYhN4ryEwLs5pjx8TqBwpaEFhZnwpH60qHxMI1wfgDFOSBPFh3uaZCHkAmE91WQA86JkYepUA+M6hnHV+q/CQw8ZvCIC/HcpV+cmfznyHjX8RAK72sdUwodoZrGKx2PmvQ7FmZjeXTYfDRmt76YxF8A3o8uQalc6IQ7mbaB1udtj4FQHwmkO5QVqH7Q4bbZS0dO72DMRsjKjqXOrZRPwuAuAcz1jA7og7i+oyC3jfYdufBe9v4WWrp5tmR5FVpc9jl912MxguAv7x7IR4D9XjXs9Cj4kQV1W6tgFLKqFK2wA8KjqbAPa1qGuw8qlH6WRlSh5rgJvFPFmtb1JWbwY7yLRN0W8pBtjBy/2BZS+3iU6HU3Q/JL9rEzSXybypz5BkEHNbycuFbNm3S2p7mr7jshiwElzp2ZBjuhwAngAWFqjfQtkz6EBGHe0CkSuoGF2yB5DJKDXgC2ATcK38rEmzmCP33CRlZFnGmsi+Kq+yORN4LqVHYRwyJRU4KL2SteLEJbKG7PQd1pO/e+SctXLNoKwbnppB+VbnZ8WGyrPKs12wCVCGReeWwvY07gN+DsDBxiE/yQAspB5a07F96Dtls24TiOwF7ohxAfflwAslvRW2zOdFB4VT3bxHgPdy/CnD3VKGOj1jHP5G4GFJgBqSpmJUfr722GnOPSbHRuWcIbnGRmJvCDmjWVEURVEURVEUouMkeFfac4zyh5AAAAAASUVORK5CYII="
      />
    </Defs>
  </Svg>
);

export default Account;
