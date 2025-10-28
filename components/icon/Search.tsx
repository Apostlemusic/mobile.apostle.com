// search.tsx
import React from "react";
import Svg, { Rect, Defs, Pattern, Use, Image } from "react-native-svg";

const Search = (props: any) => (
  <Svg
    width={21}
    height={20}
    viewBox="0 0 21 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Rect x={0.5} width={20} height={20} fill="url(#pattern0_686_2159)" />
    <Defs>
      <Pattern
        id="pattern0_686_2159"
        patternContentUnits="objectBoundingBox"
        width={1}
        height={1}
      >
        <Use xlinkHref="#image0_686_2159" transform="scale(0.0104167)" />
      </Pattern>
      <Image
        id="image0_686_2159"
        width={96}
        height={96}
        preserveAspectRatio="none"
        href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAACXBIWXMAAAsTAAALEwEAmpwYAAAEsElEQVR4nO2czW9VVRDAf8iXibgQP1AR+lQMLoyuXGE3Bgwqon8AQaKB6MpES8GdK40xJmxcAEL4CkugRqRbCUT8+AMM0WAUw0I+DLSv1hKvOck0IU3P3NfX9t2Ze+eXnKR5fe/emTPnzjkzZ86FIAiCIAiCIAiCIAiCIOgtS4B+YBA4AJwDfgWuA+PSrstn6X9fyndfkN8GXbAMeBMYBkaBoss2ApwBtso1gxKeAvZLxxVz3NI19wFPVq2kRfqA48Dteej4YkpL9zgGrK5aaQskH717lm6mmMUTsQtYTINH/XcVdHwxpf3URLf0OvD3DDrpKnAC+AB4GVgL3CdP0BL5O332inznJHBtBte/AWymIbzToa9vA4eAF4G7urhP+s164LBcq5O5YQc1Z3eHvvkT4KE5vO8K4NMO55oUQ9R25Jcpf2KeVyd9wKkSGf4DtlMz3ihxOyMSePWKt0qehiTrJmrCEyUT7h/AMxXI9SxwWZErpTdaOCetUH5UlPy54oCoD7ioyPe99zjhQ0W5y9IBVfMY8Lsi506c0qf42ZGK3E6O5xRZbwGrcMhxZVT1csLtlLcVeY/gMKt5W1lqWmUoI/OEt3TFfsX1WM5CtpSoeS9OuEf85nRKfIx9PlMGj4tNnW0ZBcaAR7DPCuUp2IIDhjPCp8SaF45kdPgaB4FXbjsxZTW98JKyJDUdmPUr+fxuUspVsVD2CKbTZR2GGXS49MyRy5oOYJgDGaHfxx8DGV3SEtss5zNCp21Eb2zK6HIWw1zKCJ0iY2+szeiSKvDMktsIX44/Hszo8heGGc8I7bFGc2lGl38wTBMMMI5h6uSCHsjoknQ0SxMm4d8wzLmM0KlirS7L0G9xGIilckFv7PSYVMwJnWo1vTHkcTD1KxNXSnB5YZHUBblLxmnp6FQo64WNGR3SRs3dGOdMRvhUpeyFoxkdUobUPFuV0ZO2+6yzUqLd6XRI263mWaa4oVQibp3PM7LfBO7FCfsySowaKUfMsUYZ/V/giDVKYZZlP3paKcxyF80fyyhTSH2+Nd5V5E0BpjtWK3PBqNTnW+F5pRbIejWfyi4H5ekt4Ioip+nIt4xUQ/ODotzFio3QAn5R5LsgUbFrHldqbFL7U+rzq3A7VxS5btThiNIkm0sO6bWlPr+XE25bkaeQCo+0K1YbdpQoXEgGsjXPy+PTHcgx2b6pmxEG5RyupnRbSsQfnsP7PioRbi7IapQRtnf4qoIxqVLe0GUqe6FkNY922fG1NsJrSr49NyGeknLBtFX4NHD/HS/rWC6fvSqbQkNdXP9804zQknO4RcXtgsiyVDq5UUZIa+z3JNPY644fBT6aUu+fnqavSn437GFTZqasEn8/0YOOnwAOKumFRj4Jd75XYq9yyK+YRbspKeVOspqNNsLkScstciZrNsZoy+S9rYvNlMYbYZLFUokwIIcjzkqJ+FWp0/xXVjyXpGjqkCTQ1s2Brw4jGKCxE7MlwggGCCMYIIxggDCCAcIIBggjGCCMYIAI1pwYYU/VQjbdCLeABVUL2WQjjDl7ZU/tjJD2IIIeGmGPuJ0x6XwXL/yrGwvC7wdBEARBEARBEARBgA/+BzLQf/OpT2twAAAAAElFTkSuQmCC"
      />
    </Defs>
  </Svg>
);

export default Search;
