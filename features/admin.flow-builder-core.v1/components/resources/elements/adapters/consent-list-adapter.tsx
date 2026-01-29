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

import Box from "@oxygen-ui/react/Box";
import Code from "@oxygen-ui/react/Code";
import Checkbox from "@oxygen-ui/react/Checkbox";
import FormControlLabel from "@oxygen-ui/react/FormControlLabel";
import Stack from "@oxygen-ui/react/Stack";
import Tooltip from "@oxygen-ui/react/Tooltip";
import Typography from "@oxygen-ui/react/Typography";
import { CircleInfoIcon } from "@oxygen-ui/react-icons";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import {
    ConsentListItemInterface,
    ConsentType,
    useGetConsent,
    useGetConsents
} from "@wso2is/common.consents.v1";
import React, { FunctionComponent, ReactElement, useMemo } from "react";
import { Trans, useTranslation } from "react-i18next";
import useRequiredFields, { RequiredFieldInterface } from "../../../../hooks/use-required-fields";
import PlaceholderComponent from "./placeholder-component";
import { CommonElementFactoryPropsInterface } from "../common-element-factory";
import "./consent-list-adapter.scss";

/**
 * Props interface of {@link ConsentListAdapter}
 */
export type ConsentListAdapterPropsInterface = IdentifiableComponentInterface & CommonElementFactoryPropsInterface;

/**
 * Adapter for the Consent List component.
 *
 * @param props - Props injected to the component.
 * @returns The ConsentListAdapter component.
 */
export const ConsentListAdapter: FunctionComponent<ConsentListAdapterPropsInterface> = ({
    resource
}: ConsentListAdapterPropsInterface): ReactElement => {
    const { t } = useTranslation();

    const {
        data: consents,
        isLoading: isConsentsLoading
    } = useGetConsents();

    const generalMessage: ReactElement = useMemo(() => {
        return (
            <Trans
                i18nKey="flows:core.validation.fields.consent.general"
                values={ { id: resource.id } }
            >
                Required fields are not properly configured for the consent field with ID <Code>{ resource.id }</Code>.
            </Trans>
        );
    }, [ resource?.id ]);

    const fields: RequiredFieldInterface[] = useMemo(() => {
        return [
            {
                errorMessage: t("flows:core.validation.fields.consent.consent"),
                name: "consent"
            }
        ];
    }, [ t ]);

    useRequiredFields(
        resource,
        generalMessage,
        fields
    );

    const consentId = useMemo(() => {
        return resource?.config?.consent || null;
    }, [ resource?.config?.consent ]);

    const {
        data: consent,
        isLoading: isConsentLoading
    } = useGetConsent(consentId);

    const isLoading = isConsentsLoading || (consentId && isConsentLoading);

    if (isLoading) {
        return <Typography>{ t("common:loading") }</Typography>;
    }

    if (!consent) {
        return (
            <Box className="consent-list-adapter-placeholder">
                <Typography variant="body2" color="textSecondary">
                    Select a consent purpose to display the consent list.
                </Typography>
            </Box>
        );
    }

    const { displayName, description } = resource.config || {};

    return (
        <Box className="consent-list-adapter">
            <Stack direction="column" spacing={ 1 }>
                { (displayName || description) && (
                    <Box className="consent-list-adapter-header">
                        { displayName && (
                            <Typography variant="body1">
                                <PlaceholderComponent value={ displayName }>
                                    { displayName }
                                </PlaceholderComponent>
                            </Typography>
                        ) }
                        { description && (
                            <Tooltip title={ description }>
                                <Box ml={ 1 } display="flex">
                                    <CircleInfoIcon size={ 16 } />
                                </Box>
                            </Tooltip>
                        ) }
                    </Box>
                ) }
                { consent.elements?.map((element: any, index: number) => (
                    <FormControlLabel
                        key={ index }
                        control={
                            <Checkbox
                                size="small"
                                defaultChecked={ element.isMandatory }
                                disabled={ element.isMandatory }
                            />
                        }
                        label={
                            <Typography variant="body2">
                                { element.displayName || element.name }
                                { element.isMandatory && (
                                    <Box component="span" ml={ 0.5 } color="error.main">*</Box>
                                ) }
                            </Typography>
                        }
                    />
                )) }
            </Stack>
        </Box>
    );
};

export default ConsentListAdapter;
