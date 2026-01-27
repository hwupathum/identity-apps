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
import React from "react";
import { EmphasizedSegment, PrimaryButton } from "@wso2is/react-components";
import { Grid, Loader } from "semantic-ui-react";
import { FinalForm, FinalFormField } from "@wso2is/form";
import { TextFieldAdapter } from "@wso2is/form/src";
import Typography from "@oxygen-ui/react/Typography";
import UserAttributeList, { SelectedUserAttributeInterface } from "../user-attributes/user-attribute-list";
import Box from "@oxygen-ui/react/Box/Box";

interface EditConsentAttributesProps {
    consentId: string;
}

export const EditConsentAttributes = (props: EditConsentAttributesProps) => {
    const { consentId } = props;

    const [isAttributesInfoLoading, setIsAttributesInfoLoading] = React.useState<boolean>(false);

    // Mock data lookup by consent ID
    const getMockAttributesData = (id: string) => {
        const mockData: Record<string, any> = {
            "2b884c27-4087-4e68-b5e8-6ae698e7790b": {
                description: "This consent allows us to collect and use your data for analytics and improving our services.",
                attributes: [
                    {
                        claimURI: "http://wso2.org/claims/emailaddress",
                        displayName: "Email",
                        mandatory: true
                    },
                    {
                        claimURI: "http://wso2.org/claims/username",
                        displayName: "Username",
                        mandatory: false
                    }
                ]
            }
        };

        return mockData[id] || {
            description: "",
            attributes: []
        };
    };

    const mockData = getMockAttributesData(consentId);
    const [AttributesInfo, setAttributesInfo] = React.useState<any>({
        description: mockData.description
    });
    const [selectedUserAttributes, setSelectedUserAttributes] = React.useState<SelectedUserAttributeInterface[]>(
        mockData.attributes || []
    );

    const updateAttributesInfo = (values: any) => {
        // TODO: Implement update logic
        console.log("Updating attributes info:", values);
        console.log("Selected attributes:", selectedUserAttributes);
    };

    return (
        <>
            <EmphasizedSegment
                padded="very"
                className="consent-attributes-form"
            >
                <Box className="form-container with-max-width">
                    {
                        isAttributesInfoLoading ? <Loader /> : (
                            <FinalForm
                                onSubmit={(values: any) => {
                                    updateAttributesInfo(values);
                                }}
                                initialValues={AttributesInfo}
                                render={({ handleSubmit }) => (
                                    <form onSubmit={handleSubmit}>
                                        <Grid columns={1}>
                                            <Grid.Row>
                                                <Grid.Column>
                                                    <FinalFormField
                                                        name="description"
                                                        label="Description"
                                                        type="text"
                                                        component={TextFieldAdapter}
                                                        required
                                                        placeholder="Enter consent description"
                                                        multiline
                                                        rows={4}
                                                    />
                                                </Grid.Column>
                                            </Grid.Row>
                                            <Grid.Row>
                                                <Grid.Column>
                                                    <Typography variant="h6" className="heading-container">
                                                        User Attributes
                                                    </Typography>
                                                    <UserAttributeList
                                                        initialValues={mockData.attributes}
                                                        onAttributesChange={(hasChanged: boolean, attributes: SelectedUserAttributeInterface[]) => {
                                                            setSelectedUserAttributes(attributes);
                                                        }}
                                                        isReadOnly={false}
                                                        data-componentid="edit-consent-user-attributes"
                                                    />
                                                </Grid.Column>
                                            </Grid.Row>
                                            <Grid.Row>
                                                <Grid.Column>
                                                    <PrimaryButton type="submit">
                                                        Update
                                                    </PrimaryButton>
                                                </Grid.Column>
                                            </Grid.Row>
                                        </Grid>
                                    </form>
                                )}
                            />
                        )
                    }
                </Box>
            </EmphasizedSegment>
        </>
    );
};
