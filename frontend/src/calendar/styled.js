import styled from "styled-components";

export const Wrapper = styled.div`
  border: 1px solid;
  height: calc(99vh - 60px); /* Adjust the 60px to your DateControls height */
`;

export const StyledEvent = styled.span`
  background: ${({ bgColor }) => bgColor};
  color: white;
  text-align: left !important;
  padding: 2px 10px;
  margin: 0 2px;
  border-radius: 10px;
  font-size: 13px;
  cursor: move;
  text-transform: capitalize;
`;

export const calendarWrapper = styled.div`
  padding-top: 80px;
  `;

export const HeadDays = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px; // Or whatever height your cells are
  background: maroon;
  color: white;// Ensure it's a block-level element to fill the width
  width: 100%; // Stretch to the full width of the grid column
  box-sizing: border-box; // Ensure padding and border are included in the width
  
`;


export const SevenColGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(${props => props.is28Days ? 5 : 6}, minmax(120px, auto)); // Increase the minimum size
  ${(props) => props.fullheight && `height: calc(100% - 75px);`}
  
  div {
    display: grid;
    border: 1px solid;
    ${StyledEvent} {
      display: none;
    }
    ${StyledEvent}:nth-child(-n + 3) {
      display: block;
    }

    span {
      text-align: right;
      padding-right: 15px;
      height: fit-content;
    }

    span.active {
      background-color: pink;
      border-bottom: 2px solid red;
      position: relative;
    }
    span.active::before {
      content: "Today ";
      font-size: 14px;
    }
  }
`;

// export const HeadDays = styled.span`
//   text-align: center;
//   border: 1px solid;
//   height: 30px;
//   padding: 5px;
//   background: darkolivegreen;
//   color: white;
// `;

export const DateControls = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
  padding: 10px 0;
  align-items: center;

  ion-icon {
    font-size: 1.6rem;
    cursor: pointer;
  }
`;

export const SeeMore = styled.p`
  font-size: 12px;
  padding: 0 5px;
  margin-bottom: 0;
  cursor: pointer;
`;

export const PortalWrapper = styled.div`
background: #f9f9f9; // A softer background color
position: absolute;
width: 60%;
height: 200px;
top: 50%;
left: 50%;
border-radius: 10px; // Slightly larger border radius for a softer look
transform: translate(-50%, -50%);
box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); // A softer shadow
padding: 20px;
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
transition: all 0.3s ease; // Smooth transition for hover effects

&:hover {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15); // Enhanced shadow on hover
  transform: translate(-50%, -48%);
}

h2 {
  font-size: 2rem; // Adjusted for better readability
  color: #333; // Darker color for better contrast
  margin-bottom: 10px;
}

ion-icon {
  font-size: 1.5rem;
  color: #fff;
  background: #007bff; // A more modern blue
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer; // Cursor changes to pointer to indicate it's clickable
  margin: 5px;

  &:hover {
    background: #0056b3; // Darker shade on hover
  }
}

ion-icon[name="close-outline"] {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #dc3545; // A standard red color for close buttons
  color: #fff;
}

p {
  color: #666; // Slightly darker for better readability
  margin-bottom: 15px;
}
`;
