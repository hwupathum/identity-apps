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

import { useEffect, useState } from "react";
import { getConsentTypes } from "./consents";
import { ConsentTypeInterface } from "../models/consents";

/**
 * Hook to get the list of consent types.
 *
 * @returns The list of consent types and the loading state.
 */
export const useGetConsentTypes = () => {
    const [consentTypes, setConsentTypes] = useState<ConsentTypeInterface[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        setIsLoading(true);

        getConsentTypes()
            .then((response: ConsentTypeInterface[]) => {
                setConsentTypes(response);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    return {
        data: consentTypes,
        isLoading
    };
};
