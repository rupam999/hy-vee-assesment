'use client';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Error from '@/components/Alert/Error';
import { GET_AGE, GET_COUNTRY, GET_GENDER } from '@/config/Endpoint';
import { getRequest } from '@/requests/getRequest';
import { useEffect, useState } from 'react';

const Home = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [isUserNameChange, setIsUserNameChange] = useState(false);
	const [message, setMessage] = useState('');
	const [userName, setUserName] = useState('');
	const [userAge, setUserAge] = useState(-1);
	const [userGender, setUserGender] = useState('');
	const [userCountry, setUserCountry] = useState('');

	useEffect(() => {
		let timer: any;
		if (message !== '') {
			timer = setTimeout(() => {
				setMessage('');
			}, 1000);
		}

		return () => clearTimeout(timer);
	}, [message]);

	const handleNameChange = (
		event: React.ChangeEvent<HTMLInputElement> | undefined
	) => {
		try {
			setIsUserNameChange(true);
			if (event && event.target && event.target.value) {
				setUserName(event.target.value);
			} else {
				throw new Error('Invalid event or target value');
			}
		} catch (error) {
			// You can also set a default or fallback value for userName if needed
			setUserName(''); // For example, setting userName to an empty string
		}
	};

	const getUserDetails = async () => {
		try {
			if (userName.length === 0) {
				setMessage('Please enter a name!');
				return;
			}

			setIsLoading(true);
			setIsUserNameChange(false);
			setMessage('');

			// Using Promise.all to fetch user details concurrently
			await Promise.all([
				getUserAge(userName),
				getUserGender(userName),
				getUserCountry(userName),
			]);
		} catch (error: any) {
			// Logging the error if any of the requests fail
			setMessage(error?.toString());
		} finally {
			setIsLoading(false);
		}
	};

	const getUserAge = async (name: string) => {
		try {
			// Fetching user age using getRequest function
			const response = await getRequest(GET_AGE, name);

			// Checking if response exists
			if (response) {
				const { age = null } = response.data;

				// Setting user age if it exists
				if (age !== null) {
					setUserAge(age);
				} else {
					// Throwing error if response is empty
					setMessage('No data found for the given username!');
				}
			} else {
				// Throwing error if response is empty
				throw new Error('No data found for the given username!');
			}
		} catch (error: any) {
			// Propagating error to the calling function
			throw new Error(error.message);
		}
	};

	const getUserGender = async (name: string) => {
		try {
			// Fetching user gender using getRequest function
			const response = await getRequest(GET_GENDER, name);

			// Checking if response exists
			if (response) {
				const { gender = null } = response.data;

				// Setting user gender if it exists
				if (gender !== null) {
					setUserGender(gender);
				} else {
					// Throwing error if response is empty
					setMessage('No data found for the given username!');
				}
			} else {
				// Throwing error if response is empty
				throw new Error('No data found for the given username!');
			}
		} catch (error: any) {
			// Propagating error to the calling function
			throw new Error(error?.message);
		}
	};

	const getUserCountry = async (name: string) => {
		try {
			// Fetching user country using getRequest function
			const response = await getRequest(GET_COUNTRY, name);

			// Checking if response exists
			if (response) {
				const { country = [] } = response.data;

				// Setting user country if it exists
				if (country.length > 0) {
					const { country_id = '' } = country[0];

					if (country_id) {
						setUserCountry(country_id);
					} else {
						// Throwing error if response is empty
						setMessage('No data found for the given username!');
					}
				}
			} else {
				// Throwing error if response is empty
				throw new Error('No data found for the given username!');
			}
		} catch (error: any) {
			// Propagating error to the calling function
			throw new Error(error?.message);
		}
	};

	return (
		<div>
			<Header />
			<div className=" min-h-screen">
				<div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
					<div className="mx-auto max-w-lg text-center">
						<h1 className="text-2xl font-bold sm:text-3xl">
							Get user details!
						</h1>

						<p className="mt-4 text-gray-500">
							Please input a name, and we&apos;ll endeavor to determine their
							age, gender, and country based on the provided name.
						</p>

						{!isUserNameChange &&
						userAge &&
						userGender &&
						userCountry &&
						!isLoading ? (
							<p className="mt-4 text-gray-500">
								{userName}, a {userAge}-year-old {userGender}, from{' '}
								{userCountry}.
							</p>
						) : (
							isLoading && <p className="mt-4 text-gray-500">Getting Data...</p>
						)}

						{message && <Error message={message} />}
					</div>

					<div className="mx-auto mb-0 mt-8 max-w-md space-y-4">
						<div>
							<label htmlFor="name" className="sr-only">
								Name
							</label>

							<div className="relative">
								<input
									type="name"
									className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
									onChange={(event) => handleNameChange(event)}
									placeholder="Enter name"
								/>
							</div>
						</div>

						<div className="flex items-center justify-between w-[100%]">
							<button
								type="submit"
								className="w-[100%] inline-block rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white"
								onClick={isLoading ? () => {} : getUserDetails}
							>
								{isLoading ? 'Loading...' : 'Submit'}
							</button>
						</div>
					</div>
				</div>
			</div>
			<Footer />
		</div>
	);
};

export default Home;
