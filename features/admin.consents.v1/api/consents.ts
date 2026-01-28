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

import {
    DefaultConsentElements,
    DefaultConsentPurposes,
    DefaultConsentTypes,
    DefaultPurposesList
} from "../data";
import {
    ConsentElementInterface,
    ConsentInterface,
    ConsentListItemInterface,
    ConsentTypeInterface
} from "../models/consents";

/**
 * Gets the list of consents (purposes).
 *
 * @returns A promise containing the list of consents.
 */
export const getConsents = (): Promise<ConsentListItemInterface[]> => {
    return Promise.resolve(DefaultConsentPurposes.map((purpose: any) => {
        const typeId: string = purpose.name.split(":")[ 0 ];
        const type: any = DefaultConsentTypes.find((type: any) => type.id === typeId);

        return {
            ...purpose,
            type: type ? type.name : typeId,
            isDefault: DefaultPurposesList.includes(purpose.name)
        };
    }));
};

/**
 * Gets the consent details by ID.
 *
 * @param id - ID of the consent.
 * @returns A promise containing the consent details.
 */
export const getConsent = (id: string): Promise<ConsentInterface> => {
    const purpose: any = DefaultConsentPurposes.find((purpose: any) => purpose.id === id);

    if (!purpose) {
        return Promise.resolve(null);
    }

    const typeId: string = purpose.name.split(":")[ 0 ];
    const type: any = DefaultConsentTypes.find((type: any) => type.id === typeId);

    const resolvedElements = purpose.elements.map((purposeElement: any) => {
        const elementDetails = DefaultConsentElements.find((element: any) => element.name === purposeElement.name);

        return {
            ...purposeElement,
            ...elementDetails
        };
    });

    const policyUrl = resolvedElements.find((element: any) => element.name.startsWith("url:"))?.properties?.url;

    return Promise.resolve({
        ...purpose,
        type: type ? type.name : typeId,
        elements: resolvedElements,
        policyUrl,
        isDefault: DefaultPurposesList.includes(purpose.name)
    });
};

/**
 * Gets the list of consent types.
 *
 * @returns A promise containing the list of consent types.
 */
export const getConsentTypes = (): Promise<ConsentTypeInterface[]> => {
    return Promise.resolve(DefaultConsentTypes);
};

/**
 * Gets the list of consent elements.
 *
 * @returns A promise containing the list of consent elements.
 */
export const getConsentElements = (): Promise<ConsentElementInterface[]> => {
    return Promise.resolve(DefaultConsentElements);
};

/**
 * Updates the consent details.
 *
 * @param id - ID of the consent.
 * @param consent - Updated consent details.
 * @returns A promise containing the updated consent details.
 */
export const updateConsent = (id: string, consent: Partial<ConsentInterface>): Promise<ConsentInterface> => {
    const consentIndex: number = DefaultConsentPurposes.findIndex((purpose: any) => purpose.id === id);

    if (consentIndex === -1) {
        return Promise.reject("Consent not found");
    }

    if (consent.elements) {
        consent.elements.forEach((updatedElement: any) => {
            const globalElementIndex = DefaultConsentElements.findIndex(
                (el: any) => el.name === updatedElement.name
            );

            if (globalElementIndex !== -1 && updatedElement.properties) {
                DefaultConsentElements[ globalElementIndex ] = {
                    ...DefaultConsentElements[ globalElementIndex ],
                    properties: {
                        ...DefaultConsentElements[ globalElementIndex ].properties,
                        ...updatedElement.properties
                    }
                };
            }
        });
    }

    const updatedConsent: any = {
        ...DefaultConsentPurposes[ consentIndex ],
        ...consent
    };

    DefaultConsentPurposes[ consentIndex ] = updatedConsent;

    return Promise.resolve(updatedConsent);
};
