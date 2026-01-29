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

import Autocomplete, { AutocompleteRenderInputParams } from "@oxygen-ui/react/Autocomplete";
import FormHelperText from "@oxygen-ui/react/FormHelperText";
import Stack from "@oxygen-ui/react/Stack";
import TextField from "@oxygen-ui/react/TextField";
import {
    ConsentListItemInterface,
    ConsentType,
    useGetConsents
} from "@wso2is/common.consents.v1";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { ChangeEvent, FunctionComponent, ReactElement, useMemo } from "react";
import useValidationStatus from "../../hooks/use-validation-status";
import { Resource } from "../../models/resources";

/**
 * Props interface of {@link ConsentPropertyField}
 */
export interface ConsentPropertyFieldPropsInterface extends IdentifiableComponentInterface {
    /**
     * The resource associated with the property.
     */
    resource: Resource;
    /**
     * The key of the property.
     */
    propertyKey: string;
    /**
     * The value of the property.
     */
    propertyValue: string;
    /**
     * The event handler for the property change.
     * @param propertyKey - The key of the property.
     * @param newValue - The new value of the property.
     * @param resource - The resource associated with the property.
     */
    onChange: (propertyKey: string, newValue: any, resource: Resource) => void;
    /**
     * Additional props.
     */
    [ key: string ]: any;
}

/**
 * Consent property field component for selecting consents.
 *
 * @param props - Props injected to the component.
 * @returns The ConsentPropertyField component.
 */
const ConsentPropertyField: FunctionComponent<ConsentPropertyFieldPropsInterface> = ({
    "data-componentid": componentId = "consent-property-field",
    resource,
    propertyKey,
    propertyValue,
    onChange,
    ...rest
}: ConsentPropertyFieldPropsInterface): ReactElement => {
    const { data: consents, isLoading } = useGetConsents();
    const { selectedNotification } = useValidationStatus();

    const dataUsageConsents: ConsentListItemInterface[] = useMemo(() => {
        if (!consents) {
            return [];
        }

        return consents.filter((consent: ConsentListItemInterface) => consent.type === ConsentType.DATA_USAGE);
    }, [ consents ]);

    const selectedConsent: ConsentListItemInterface = useMemo(() => {
        return dataUsageConsents.find((consent: ConsentListItemInterface) =>
            consent.id === propertyValue) || null;
    }, [ dataUsageConsents, propertyValue ]);

    /**
     * Get the error message for the consent property field.
     */
    const errorMessage: string = useMemo(() => {
        const key: string = `${resource?.id}_${propertyKey}`;

        if (selectedNotification?.hasResourceFieldNotification(key)) {
            return selectedNotification?.getResourceFieldNotification(key);
        }

        return "";
    }, [ resource, selectedNotification, propertyKey ]);

    return (
        <Stack data-componentid={ componentId }>
            <Autocomplete
                disablePortal
                key={ resource.id }
                loading={ isLoading }
                options={ dataUsageConsents }
                getOptionLabel={ (option: ConsentListItemInterface) => option.displayName || option.name }
                value={ selectedConsent }
                onChange={ (_: ChangeEvent<HTMLInputElement>, newValue: ConsentListItemInterface) => {
                    onChange(`config.${propertyKey}`, newValue?.id || "", resource);
                } }
                renderInput={ (params: AutocompleteRenderInputParams) => (
                    <TextField
                        { ...params }
                        label="Consent"
                        placeholder="Select consent"
                        required
                        error={ !!errorMessage }
                        { ...rest }
                    />
                ) }
            />
            {
                errorMessage && (
                    <FormHelperText error>
                        { errorMessage }
                    </FormHelperText>
                )
            }
        </Stack>
    );
};

export default ConsentPropertyField;
