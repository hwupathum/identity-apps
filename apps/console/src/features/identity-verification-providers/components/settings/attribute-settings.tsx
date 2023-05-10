/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { AccessControlConstants, Show } from "@wso2is/access-control";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { AlertLevels, Claim, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { EmphasizedSegment } from "@wso2is/react-components";
import { AxiosError } from "axios";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Button, Divider, Grid } from "semantic-ui-react";
import { AttributesSelectionV2 } from "./attribute-management/attribute-selection-v2";
import { getAllLocalClaims } from "../../../claims";
import { updateIdentityVerificationProvider } from "../../api";
import {
    IDVPClaimMappingInterface,
    IDVPClaimsInterface,
    IDVPLocalClaimInterface,
    IdentityVerificationProviderInterface
} from "../../models";
import { handleIDVPUpdateError, handleIDVPUpdateSuccess } from "../../utils";
import { handleGetAllLocalClaimsError, isLocalIdentityClaim } from "../utils";

interface AttributeSettingsPropsInterface extends IdentifiableComponentInterface {
    /**
     * Identity verification provider that is being edited.
     */
    idvp: IdentityVerificationProviderInterface;

    /**
     * Initial claims of IDVP.
     */
    initialClaims?: IDVPClaimMappingInterface[];

    /**
     * Is the IDVP info request loading.
     */
    isLoading?: boolean;

    /**
     * Callback to call when updating the IDVP details.
     */
    onUpdate: () => void;
    /**
     * This boolean attribute specifies whether local identity claims
     * should be hidden or not. By default, we will show these attributes
     * see {@link AttributeSettings.defaultProps}.
     *
     * For an example, setting this to `true` will hide:-
     *  - http://wso2.org/claims/identity/accountLocked
     *  - http://wso2.org/claims/identity/isExistingLiteUser
     *  - etc...
     */
    hideIdentityClaimAttributes?: boolean;
    /**
     * Specifies if the component should only be read-only.
     */
    isReadOnly: boolean;
    /**
     * Loading Component.
     */
    loader: () => ReactElement;
}

export const AttributeSettings: FunctionComponent<AttributeSettingsPropsInterface> = (
    props: AttributeSettingsPropsInterface
): ReactElement => {

    const {
        idvp,
        initialClaims,
        isLoading,
        onUpdate,
        hideIdentityClaimAttributes,
        isReadOnly,
        loader: Loader,
        ["data-componentid"]: componentId
    } = props;

    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();

    // Manage available local claims.
    const [ availableLocalClaims, setAvailableLocalClaims ] = useState<IDVPLocalClaimInterface[]>([]);

    // Selected local claims in claim mapping.
    const [ selectedClaimsWithMapping, setSelectedClaimsWithMapping ]
        = useState<IDVPClaimMappingInterface[]>([]);

    const [ isSubmissionLoading, setIsSubmissionLoading ] = useState<boolean>(false);

    /**
     * When IdP loads, this component is responsible for fetching the
     * available claims. So, to indicate a network call is happening
     * we need this to hide the form. if `!isLocalClaimsLoading`
     * and `!isLoading` will load the form.
     */
    const [ isLocalClaimsLoading, setIsLocalClaimsLoading ] = useState<boolean>(true);

    useEffect(() => {
        setIsLocalClaimsLoading(true);
        getAllLocalClaims(null)
            .then((response: Claim[]) => {
                setAvailableLocalClaims(response?.map((claim: Claim) => {
                    return {
                        displayName: claim.displayName,
                        id: claim.id,
                        uri: claim.claimURI
                    } as IDVPLocalClaimInterface;
                }));
            })
            .catch((error: IdentityAppsApiException) => {
                handleGetAllLocalClaimsError(error);
            })
            .finally(() => {
                setIsLocalClaimsLoading(false);
            });
    }, []);


    /**
     * Set initial value for claim mapping.
     */
    useEffect(() => {
        if (isEmpty(availableLocalClaims)) {
            return;
        }
        setInitialValues();
    }, [ availableLocalClaims ]);

    const setInitialValues = () => {

        if (!initialClaims) {
            return;
        }

        initialClaims.forEach((claim: IDVPClaimMappingInterface) => {
            claim.localClaim = availableLocalClaims.find((localClaim: IDVPLocalClaimInterface) => {
                return localClaim.uri === claim.localClaim.uri;
            });
        });

        setSelectedClaimsWithMapping(initialClaims);

    };

    const onAttributesSelected = (mappingsToBeAdded: IDVPClaimMappingInterface[]): void => {
        setSelectedClaimsWithMapping([ ...mappingsToBeAdded ]);
    };

    const canSubmitAttributeUpdate = (): boolean => {
        return isEmpty(selectedClaimsWithMapping?.filter(
            (element: IDVPClaimMappingInterface) => isEmpty(element.idvpClaim)
        ));
    };

    const handleAttributesUpdate = (): void => {

        idvp.claims = selectedClaimsWithMapping.map((element: IDVPClaimMappingInterface) => {
            return {
                idvpClaim: element.idvpClaim,
                localClaim: element.localClaim.uri
            } as IDVPClaimsInterface;
        });

        if (canSubmitAttributeUpdate()) {
            setIsSubmissionLoading(true);
            updateIdentityVerificationProvider(idvp)
                .then(handleIDVPUpdateSuccess)
                .catch((error: AxiosError) => {
                    handleIDVPUpdateError(error);
                }).finally(() => {
                    setIsSubmissionLoading(false);
                    onUpdate();
                });
        } else {
            dispatch(addAlert(
                {
                    description: t("console:develop.features.idvp.notifications.submitAttributeSettings" +
                        ".error.description"),
                    level: AlertLevels.WARNING,
                    message: t("console:develop.features.idvp.notifications.submitAttributeSettings.error.message")
                }
            ));
        }
    };


    if (isLoading || isLocalClaimsLoading) {
        return <Loader/>;
    }

    return (
        <EmphasizedSegment padded="very">
            <Grid className="attributes-settings">
                <div className="form-container with-max-width">
                    <Grid.Row columns={ 1 }>
                        <Grid.Column>
                            <AttributesSelectionV2
                                onAttributesSelected={ onAttributesSelected }
                                attributeList={
                                    hideIdentityClaimAttributes
                                        ? availableLocalClaims.filter(
                                            ({ uri }: IDVPLocalClaimInterface) => !isLocalIdentityClaim(uri)
                                        ) : availableLocalClaims
                                }
                                mappedAttributesList={ [ ...selectedClaimsWithMapping ] }
                                isReadOnly={ isReadOnly }
                            />
                        </Grid.Column>
                    </Grid.Row>
                    <Divider hidden/>

                    <Grid.Row>
                        <Grid.Column>
                            <Show when={ AccessControlConstants.IDP_EDIT }>
                                <Button
                                    primary
                                    size="small"
                                    loading={ isSubmissionLoading }
                                    disabled={ isSubmissionLoading }
                                    onClick={ handleAttributesUpdate }
                                    data-componentid={ `${ componentId }-update-button` }
                                >
                                    { t("common:update") }
                                </Button>
                            </Show>
                        </Grid.Column>
                    </Grid.Row>
                </div>
            </Grid>
        </EmphasizedSegment>
    );
};

/**
 * Default proptypes for the IDP attribute settings component.
 */
AttributeSettings.defaultProps = {
    "data-componentid": "idp-edit-attribute-settings",
    hideIdentityClaimAttributes: false
};
