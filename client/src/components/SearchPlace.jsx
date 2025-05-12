import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GoogleReviews from '../components/GoogleReviews.jsx';
import '../App.css';

const SearchPlace = () => {
  const [placeDetails, setPlaceDetails] = useState(null);
  const [nearPlaces, setNearPlaces] = useState([]);

  useEffect(() => {
    const checkAndInit = () => {
      if (window.google && window.google.maps) {
        init();
      } else {
        setTimeout(checkAndInit, 300);
      }
    };
    const loadScript = () => {
      const script = document.createElement('script');
      script.type = 'module';
      script.src = 'https://unpkg.com/@googlemaps/extended-component-library@0.6.11';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        checkAndInit();
      };
      document.head.appendChild(script);
    };

    loadScript();

    const init = async () => {
      await window.customElements.whenDefined('gmp-map');

      const map = document.querySelector('gmp-map');
      const marker = document.querySelector('gmp-advanced-marker');
      const placePicker = document.querySelector('gmpx-place-picker');
      const infowindow = new window.google.maps.InfoWindow();

      const placesService = new window.google.maps.places.PlacesService(map.innerMap);

      map.innerMap.setOptions({ mapTypeControl: false });

      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          function (position) {
            let latitude = position.coords.latitude;
            let longitude = position.coords.longitude;

            console.log('현재 위치: 위도=' + latitude + ', 경도=' + longitude);
            const location = new window.google.maps.LatLng(latitude, longitude);
            // console.log(location.lat()) // 위도
            // console.log(location.lng()) // 경도
            const request = {
              fields: ['displayName', 'location', 'businessStatus'],
              location: location,
              radius: 1000,
              type: ['restaurant'],
            };
            axios
              .get('http://localhost:3000', {
                withCredentials: true,
                headers: {
                  location: location
                }
              })
              .then((res) => {
                // console.log(res.data);
                setNearPlaces(res.data)
              })
              .catch((err) => {
                console.log(err);
              });
          },
          function (error) {
            console.log('위치 정보 가져오기 실패: ' + error.message);
          },
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
          }
        );
      } else {
        console.log('Geolocation API를 지원하지 않는 브라우저입니다.');
      }

      placePicker.addEventListener('gmpx-placechange', (e) => {
        const place = placePicker.value;

        if (!place || !place.location) {
          console.log('선택된 장소에 위치 정보가 없습니다.');
          return;
        }

        if (place.id) {
          placesService.getDetails(
            {
              placeId: place.id,
              fields: [
                'name',
                'formatted_address',
                'rating',
                'reviews',
                'photos',
                'formatted_phone_number',
                'types',
                'geometry',
              ],
            },
            (result, status) => {
              setPlaceDetails(result);
              if (status === window.google.maps.places.PlacesServiceStatus.OK && result) {
                setPlaceDetails(result);
                infowindow.setContent(`
                      <strong>${result.name}</strong><br/>
                      ${result.formatted_address}<br/>
                      평점: ${result.rating}<br/>
                      리뷰: ${result.reviews?.[0]?.text || '없음'}
                    `);
                infowindow.open(map.innerMap, marker);
              }

              if (status === window.google.maps.places.PlacesServiceStatus.OK && result) {
                infowindow.setContent(`
                  <strong>${result.name}</strong><br/>
                  ${result.formatted_address}<br/>
                  평점: ${result.rating}<br/>
                  리뷰: ${result.reviews?.[0]?.text || '없음'}
                `);
                infowindow.open(map.innerMap, marker);
              } else {
                if (place && place.location) {
                  placesService.nearbySearch(
                    {
                      location: place.location,
                      radius: 1000,
                      type: 'restaurant',
                    },
                    (results, status) => {
                      if (
                        status === window.google.maps.places.PlacesServiceStatus.OK &&
                        results.length > 0
                      ) {
                        const alt = results[0];
                        infowindow.setContent(`
                          <strong>${alt.name}</strong><br/>
                          주소: ${alt.vicinity}<br/>
                          평점: ${alt.rating}
                        `);
                        marker.position = alt.geometry.location;
                        infowindow.open(map.innerMap, marker);
                      } else {
                        infowindow.setContent('주변에 유사 장소를 찾을 수 없습니다.');
                        infowindow.open(map.innerMap, marker);
                      }
                    }
                  );
                } else {
                  console.log('장소가 선택되지 않았거나 위치 정보가 없습니다.');
                }
              }
            }
          );
        } else {
          alert('선택된 장소에 place_id가 없습니다.');
        }
      });
    };
  }, []);

  // console.log(placeDetails);
  console.log(
    placeDetails
      ? '음식점:' + placeDetails.types.includes('restaurant') ||
          '음식점:' + placeDetails.types.includes('food')
      : ''
  );
  console.log(nearPlaces)
  // console.log(placeDetails ? placeDetails.geometry.location.lat() : "")
  // console.log(placeDetails ? placeDetails.geometry.location.lng() : "")
  return (
    <>
      <div slot="control-block-start-inline-start" className="place-picker-container">
        <gmpx-place-picker placeholder="장소를 입력하세요" />
      </div>
      <gmp-map center={{ lat: 37.5665, lng: 126.978 }} zoom={13} map-id="DEMO_MAP_ID">
        <gmp-advanced-marker />
      </gmp-map>
      {placeDetails &&
        placeDetails.length > 1 &&
        placeDetails.map((place, i) => (
          <div key={i}>
            <h3>{place.name}</h3>
          </div>
        ))}
      {placeDetails && placeDetails !== '' && (
        <div className="container max-w-5xl mx-auto text-start">
          <div className="flex gap-2 align-center justify-center">
            {placeDetails.photos !== undefined
              ? placeDetails.photos.slice(0, 4).map((photo, i) => (
                  <div key={i} className="w-64 h-64 overflow-hidden my-2">
                    <img
                      src={photo.getUrl()}
                      alt={`place-${i}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))
              : '사진 정보가 존재하지 않음'}
          </div>
          <div>
            <h3 className="text-3xl">{placeDetails.name}</h3>
            <p></p>
          </div>
          <div>
            <p>{placeDetails.formatted_address}</p>
            <p>문의전화 : {placeDetails.formatted_phone_number}</p>
            <p>평점 : {placeDetails.rating}☆</p>
          </div>
          <GoogleReviews reviews={placeDetails.reviews} />
        </div>
      )}
      {/* {nearPlaces && nearPlaces !== '' && (

      )} */}
    </>
  );
};

export default SearchPlace;
