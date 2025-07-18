/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import FormHelperText from "@mui/material/FormHelperText";
import Box from "@oxygen-ui/react/Box";
import InputLabel from "@oxygen-ui/react/InputLabel";
import OutlinedInput from "@oxygen-ui/react/OutlinedInput";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement } from "react";
import { CommonElementFactoryPropsInterface } from "../../common-element-factory";
import Hint from "../../hint";

/**
 * Props interface of {@link OTPInputAdapter}
 */
export type OTPInputAdapterPropsInterface = IdentifiableComponentInterface & CommonElementFactoryPropsInterface;

/**
 * Adapter for the OTP inputs.
 *
 * @param props - Props injected to the component.
 * @returns The OTPInputAdapter component.
 */
export const OTPInputAdapter: FunctionComponent<OTPInputAdapterPropsInterface> = ({
    resource
}: OTPInputAdapterPropsInterface): ReactElement => {
    return (
        <div className={ resource.config?.className }>
            <InputLabel htmlFor="otp-input-adapter" required={ resource.config?.required } disableAnimation>
                { resource.config?.label }
            </InputLabel>
            <Box display="flex" flexDirection="row" gap={ 1 }>
                { [ ...Array(6) ].map((_: number, index: number) => (
                    <OutlinedInput
                        key={ index }
                        size="small"
                        id="otp-input-adapter"
                        type={ resource.config?.type }
                        style={ resource.config?.styles }
                        placeholder={ resource.config?.placeholder || "" }
                    />
                )) }
            </Box>
            {
                resource.config?.hint && (
                    <FormHelperText>
                        <Hint hint={ resource.config?.hint } />
                    </FormHelperText>
                )
            }
        </div>
    );
};

export default OTPInputAdapter;
